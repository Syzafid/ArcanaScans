
// Utility to prevent too many simultaneous API calls
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Debounce function to limit API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Rate limiter for API calls
class RateLimiter {
  constructor(maxCalls = 5, timeWindow = 1000) {
    this.maxCalls = maxCalls;
    this.timeWindow = timeWindow;
    this.calls = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    
    // Remove old calls outside the time window
    this.calls = this.calls.filter(callTime => now - callTime < this.timeWindow);
    
    // If we've reached the limit, wait
    if (this.calls.length >= this.maxCalls) {
      const oldestCall = Math.min(...this.calls);
      const waitTime = this.timeWindow - (now - oldestCall);
      if (waitTime > 0) {
        console.log(`Rate limiting: waiting ${waitTime}ms`);
        await delay(waitTime);
      }
    }
    
    // Record this call
    this.calls.push(now);
  }
}

export const apiRateLimiter = new RateLimiter(5, 1000); // 5 calls per second max
