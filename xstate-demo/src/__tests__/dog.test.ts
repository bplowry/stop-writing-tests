import { assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";

const machine = createMachine(
  {
    id: "dog",
    initial: "sleeping",
    context: {
      wakeCount: 0,
      eatCount: 0,
      sleepingCount: 0,
    },
    states: {
      sleeping: {
        on: {
          WAKE_UP: "idle",
        },
        meta: { test: () => {} },
      },
      idle: {
        on: {
          START_EATING: "eating",
          BORED: "sleeping",
          "???": "zoomies",
        },
        entry: ["wokenUp"],
        meta: { test: () => {} },
      },
      eating: {
        on: {
          DONE_EATING: "idle",
        },
        entry: ["startedEating"],
        meta: { test: () => {} },
      },
      zoomies: {
        on: {
          TIRED: "sleeping",
        },
        meta: { test: () => {} },
      },
    },
  },
  {
    actions: {
      wokenUp: assign({
        wakeCount: (context) => context.wakeCount + 1,
      }),
      startedEating: assign({
        eatCount: (context) => context.eatCount + 1,
      }),
    },
  }
);

const model = createModel(machine).withEvents({
  WAKE_UP: () => {},
  TIRED: () => {},
  BORED: () => {},
  TIME_PASSES: () => {},
  START_EATING: () => {},
  DONE_EATING: () => {},
  "???": () => {},
});

describe("dog tests", () => {
  const testPlans = model.getShortestPathPlans({
    filter: (state) =>
      state.context.wakeCount <= 4 && state.context.eatCount <= 4,
  });

  testPlans.forEach((plan, i) => {
    describe(plan.description, () => {
      plan.paths.forEach((path, i) => {
        it(
          path.description,
          async () => {
            await path.test({});
          },
          10000
        );
      });
    });
  });

  it("coverage", () => {
    model.testCoverage();
  });
});
