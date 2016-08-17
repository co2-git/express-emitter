import cluster from 'cluster';
import os from 'os';

export default function clusterServer(fn, forkNumber) {
  if (cluster.isMaster) {
    let number = forkNumber || os.cpus().length;
    const forks = [];
    for (let cursor = 0; cursor < number; cursor++) {
      forks.push(cluster.fork());
    }
    return {cluster, forks};
  }
  fn();
}
