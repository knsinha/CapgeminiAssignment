import { calculateRewards } from './utils/rewardsCalculator';

describe('Rewards Calculator', () => {
  /**
   * POSITIVE TEST CASES - Verify correct calculations
   */
  describe('Positive Test Cases', () => {
    it('should calculate points correctly for $150 transaction (whole number)', () => {
      const points = calculateRewards(150);
      expect(points).toBe(150);
      // Calculation: (2 × $50 from $100-$150) + (1 × $50 from $50-$100) = 150
    });

    it('should calculate points correctly for $125.75 transaction (fractional)', () => {
      const points = calculateRewards(125.75);
      expect(points).toBeCloseTo(101.5, 2);
      // Calculation: (2 × $25.75 from $100-$125.75) + (1 × $50 from $50-$100) = 101.5
    });

    it('should calculate points correctly for $100 transaction (minimum tier 2 threshold)', () => {
      const points = calculateRewards(100);
      expect(points).toBe(50);
      // Calculation: (1 × $50 from $50-$100) = 50
    });
  });

  /**
   * NEGATIVE TEST CASES - Verify edge cases and error handling
   */
  describe('Negative Test Cases', () => {
    it('should return 0 points for $49.99 transaction (below minimum threshold)', () => {
      const points = calculateRewards(49.99);
      expect(points).toBe(0);
      // Below $50 minimum threshold, no points earned
    });

    it('should calculate points correctly for $75 transaction (between thresholds)', () => {
      const points = calculateRewards(75);
      expect(points).toBeCloseTo(25, 2);
      // Calculation: (1 × $25 from $50-$75) = 25
    });

    it('should return 0 points for $50 transaction (edge case at boundary)', () => {
      const points = calculateRewards(50);
      expect(points).toBe(0);
      // Exactly at $50, no amount between $50-$100, so 0 points
    });
  });

  /**
   * ADDITIONAL TEST CASES - More scenarios
   */
  describe('Additional Test Cases', () => {
    it('should return 0 for amounts below $50', () => {
      expect(calculateRewards(0)).toBe(0);
      expect(calculateRewards(25)).toBe(0);
      expect(calculateRewards(49)).toBe(0);
    });

    it('should calculate points for amounts in tier 1 range ($50-$100)', () => {
      expect(calculateRewards(60)).toBeCloseTo(10, 2);
      expect(calculateRewards(80)).toBeCloseTo(30, 2);
      expect(calculateRewards(100)).toBe(50);
    });

    it('should calculate points for amounts in tier 2 range ($100+)', () => {
      expect(calculateRewards(110)).toBeCloseTo(70, 2);
      expect(calculateRewards(200)).toBe(250);
      expect(calculateRewards(175)).toBeCloseTo(200, 2);
    });
  });

  /**
   * EDGE CASES
   */
  describe('Edge Cases', () => {
    it('should return 0 for negative amounts', () => {
      expect(calculateRewards(-50)).toBe(0);
      expect(calculateRewards(-100)).toBe(0);
    });

    it('should handle zero amount', () => {
      expect(calculateRewards(0)).toBe(0);
    });

    it('should handle very small decimal amounts below threshold', () => {
      expect(calculateRewards(0.01)).toBe(0);
      expect(calculateRewards(49.99)).toBe(0);
    });

    it('should calculate correctly at exact tier boundaries', () => {
      expect(calculateRewards(50)).toBe(0);
      expect(calculateRewards(100)).toBe(50);
      expect(calculateRewards(100.01)).toBeCloseTo(50.02, 2);
    });
  });
});