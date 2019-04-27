import { getCommand } from "../src/util";

describe('util', () => {

  describe('.getCommand(...)', () => {
    it('should get quiet', () => {
      expect(getCommand({quiet: true})).toBe('-q 1');
      expect(getCommand({quiet: false})).toBe('');
    });

    it('should get probabilityEstimates', () => {
      expect(getCommand({probabilityEstimates: true})).toBe('-b 1');
      expect(getCommand({probabilityEstimates: false})).toBe('-b 0');
    });

    it('should get type', () => {
      expect(getCommand({type: 0})).toBe('-s 0');
    });

    it('should get kernel', () => {
      expect(getCommand({kernel: 2})).toBe('-t 2');
    });

    it('should get degree', () => {
      expect(getCommand({degree: 2})).toBe('-d 2');
    });

    it('should get cost', () => {
      expect(getCommand({ cost: 0.01 })).toBe('-c 0.01');
    });

    it('should get coef0', () => {
      expect(getCommand({ coef0: 0 })).toBe('-r 0');
    });

    it('should get epsilon', () => {
      expect(getCommand({ epsilon: 1 })).toBe('-p 1');
    });

    it('should get cacheSize', () => {
      expect(getCommand({ cacheSize: 300 })).toBe('-m 300');
    });

    it('should get shrinking', () => {
      expect(getCommand({ shrinking: true })).toBe('-h 1');
      expect(getCommand({ shrinking: false })).toBe('-h 0');
    });

    it('should get nu', () => {
      expect(getCommand({ nu: 0.5 })).toBe('-n 0.5');
    });

    it('should get tolerance', () => {
      expect(getCommand({ tolerance: 0.001 })).toBe('-e 0.001');
    });

    it('should get weight', () => {
      expect(getCommand({
        weight: {
          1: 3,
          2: 5,
        }
      })).toEqual('-w1 3 -w2 5');
    });

    it('should get mixed commands', () => {
      expect(getCommand({
        degree: 2,
        shrinking: true,
      })).toEqual('-d 2 -h 1');
    });
  });

});
