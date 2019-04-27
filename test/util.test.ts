import { getCommand } from "../src/util";

describe('util', () => {

  describe('.getCommand(...)', () => {
    it('should get quiet', () => {
      expect(getCommand({quiet: true})).toBe('-q 1');
      expect(getCommand({quiet: false})).toBe('');
    });

  });

});
