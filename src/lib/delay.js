const delay = (index, timer) => new Promise((resolve) => setTimeout(resolve, index * timer));
export default delay;
