import { AlgorithmKey } from './key'

export const ALGORITHM_HANDLE = {
  [AlgorithmKey.QuickSort]: 'quick-sort',
  [AlgorithmKey.MergeSort]: 'merge-sort',
  [AlgorithmKey.BFS]: 'bfs',
  [AlgorithmKey.DFS]: 'dfs',
  [AlgorithmKey.TimesTable]: 'times-table',
  [AlgorithmKey.TravelingSalesman]: 'traveling-salesman',
  [AlgorithmKey.Pathfinding]: 'pathfinding'
}

export const getAlgorithmKeyByHandle = (algorithm: string) =>
  Object.keys(ALGORITHM_HANDLE).find(
    (key) => ALGORITHM_HANDLE[key as AlgorithmKey] === algorithm
  ) as AlgorithmKey
