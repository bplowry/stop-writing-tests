import { assign, createMachine } from "xstate";
import { createModel } from "@xstate/test";

const machine = createMachine(
  {
    id: "victim",
    initial: "cabin",
    context: {
      lostHimCount: 0,
    },
    states: {
      cabin: {
        on: {
          SOMETHING_SCARY: "hiding",
        },
        meta: { test: () => {} },
      },
      hiding: {
        on: {
          BADGUY_ENTERS: "noisy",
        },
        meta: { test: () => {} },
      },
      noisy: {
        on: {
          FOUND: "running",
          CAUGHT: "dead",
        },
        meta: { test: () => {} },
      },
      running: {
        on: {
          WE_LOST_HIM: { target: "cabin", actions: "lostHim" },
          LOST: "lost",
        },
        meta: { test: () => {} },
      },
      lost: {
        on: {
          CAUGHT: "dead",
        },
        meta: { test: () => {} },
      },
      dead: {
        type: "final",
        meta: { test: () => {} },
      },
    },
  },
  {
    actions: {
      lostHim: assign({
        lostHimCount: (context) => context.lostHimCount + 1,
      }),
    },
  }
);

const model = createModel(machine).withEvents({
  SOMETHING_SCARY: () => {},
  BADGUY_ENTERS: () => {},
  FOUND: () => {},
  CAUGHT: () => {},
  LOST: () => {},
  WE_LOST_HIM: () => {},
});

describe("victim tests", () => {
  const testPlans = model.getShortestPathPlans({
    filter: (state) => state.context.lostHimCount <= 2,
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
