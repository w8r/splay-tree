import Tree from '../'
import { Node } from '../'

function main() {
  const t = new Tree<number, number>()
  t.insert(5)
  t.insert(-10)
  t.insert(0)
  t.insert(33)
  t.insert(2)

  // Assert Type
  const keys: number[] = t.keys() // [-10, 0, 2, 5, 33]
  const values: number[] = t.values()
  const size: number = t.size   // 5
  const min: number = t.min()  // -10
  const max: number = t.max()  // -33

  t.destroy()
  t.remove(0)
  t.size   // 4

  t.forEach((node) => {
    const balanceFactor: number = node.balanceFactor
    const data: number = node.data
    const key: number = node.key
    const left: Node<number, number> = node.left
    const parent: Node<number, number> = node.parent
    const right: Node<number, number> = node.right
  })
}

function customComparator() {
  const noDuplicates = true
  const t = new Tree<number, number>((a, b) => b - a)
  t.insert(5)
  t.insert(-10)
  t.insert(0)
  t.insert(33)
  t.insert(2)

  // Assert Type
  const keys: number[] = t.keys() // [33, 5, 2, 0, -10]
  const values: number[] = t.values() // [33, 5, 2, 0, -10]
}

function bulkInsert() {
  const t = new Tree<number, string>()
  t.load([3, 2, -10, 20], ['C', 'B', 'A', 'D'], true)

  // Assert Type
  const keys: number[] = t.keys()   // [-10, 2, 3, 20]
  const values: string[] = t.values() // ['A', 'B', 'C', 'D']
}
