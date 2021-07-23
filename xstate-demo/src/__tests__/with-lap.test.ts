import { assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";

let machine = createMachine(
  {
    id: "stopwatch-with-lap",
    initial: "zero",
    context: {
      resumeCount: 0,
      unlapCount: 0,
    },
    states: {
      zero: {
        on: {
          PRESS_MAIN_BUTTON: "running",
        },
        meta: {
          test: () => {},
        },
      },
      running: {
        on: {
          PRESS_MAIN_BUTTON: "stopped",
          PRESS_SECOND_BUTTON: "lap",
        },
        meta: {
          test: () => {},
        },
      },
      stopped: {
        on: {
          PRESS_MAIN_BUTTON: { target: "running", actions: "resumed" },
          PRESS_SECOND_BUTTON: "zero",
        },
        meta: {
          test: () => {},
        },
      },
      lap: {
        on: {
          PRESS_SECOND_BUTTON: { target: "running", actions: "unlapped" },
        },
        meta: {
          test: async () => {},
        },
      },
    },
  },
  {
    actions: {
      resumed: assign({
        resumeCount: (ctx) => ctx.resumeCount + 1,
      }),
      unlapped: assign({
        unlapCount: (ctx) => ctx.unlapCount + 1,
      }),
    },
  }
);

const model = createModel(machine).withEvents({
  PRESS_MAIN_BUTTON: () => {},
  PRESS_SECOND_BUTTON: () => {},
});

describe("stopwatch with lap", () => {
  const testPlans = model.getShortestPathPlans({
    filter: (state) =>
      state.context.resumeCount <= 1 && state.context.unlapCount <= 1,
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
