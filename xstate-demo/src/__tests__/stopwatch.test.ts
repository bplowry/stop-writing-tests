import { createMachine, assign } from "xstate";
import { createModel } from "@xstate/test";

let machine = createMachine(
  {
    id: "stopwatch",
    initial: "zero",
    context: {
      resumeCount: 0,
    },
    states: {
      zero: {
        on: {
          PRESS_MAIN_BUTTON: "running",
        },
        meta: {
          test: () => {
            // expect(getDisplayedTime()).toBe(0);
          },
        },
      },
      running: {
        on: {
          PRESS_MAIN_BUTTON: "stopped",
        },
        meta: {
          test: async () => {
            let t1 = getDisplayedTime();
            await sleep(10);
            let t2 = getDisplayedTime();

            // expect(t2).not.toBe(t1);
          },
        },
      },
      stopped: {
        on: {
          PRESS_MAIN_BUTTON: { target: "running", actions: "resumed" },
          PRESS_SECOND_BUTTON: "zero",
        },
        meta: {
          test: async () => {
            // try adjusting this to see how failures are displayed
            let failureThreshold = 1; // between 0 and 1
            if (Math.random() > failureThreshold) {
              throw new Error("simulated failure");
            }

            let t1 = getDisplayedTime();
            await sleep(10);
            let t2 = getDisplayedTime();

            // expect(t2).toBe(t1);
          },
        },
      },
    },
  },
  {
    actions: {
      resumed: assign({
        resumeCount: (ctx) => ctx.resumeCount + 1,
      }),
    },
  }
);

const model = createModel(machine).withEvents({
  PRESS_MAIN_BUTTON: () => {
    mainButton.click();
  },
  PRESS_SECOND_BUTTON: () => {
    secondButton.click();
  },
});

describe("stopwatch tests", () => {
  // try swapping between getSimplePathPlans and getShortestPathPlans
  const testPlans = model.getShortestPathPlans({
    filter: (state) => state.context.resumeCount <= 2,
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

// stubs
let mainButton = { click: () => undefined };
let secondButton = { click: () => undefined };
function getDisplayedTime() {
  return 0;
}
function sleep(delay: number) {
  return Promise.resolve();
}
