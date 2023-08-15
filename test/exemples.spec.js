"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('exemples', () => {
    (0, vitest_1.it)('should pass', () => {
        const expectValue = 1;
        const actualValue = 1;
        (0, vitest_1.expect)(expectValue, `Expected the value to be ${expectValue} but got ${actualValue} `).toBe(actualValue);
    });
});
