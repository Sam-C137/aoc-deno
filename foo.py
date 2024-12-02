import unittest

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

def invertTree(root):
    if root is None: return None
    queue = [root]
    while queue:
        node = queue.pop(0)
        node.left, node.right = node.right, node.left
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    return root

class TestInvertTree(unittest.TestCase):
    def treeToList(self, root):
        """Helper function to convert tree to list (level-order)"""
        if not root:
            return []
        result, queue = [], [root]
        while queue:
            node = queue.pop(0)
            if node:
                result.append(node.val)
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append(None)
        # Remove trailing None values
        while result and result[-1] is None:
            result.pop()
        return result

    def test_invertTree(self):
        # Test case 1: Empty tree
        self.assertIsNone(invertTree(None))

        # Test case 2: Single node tree
        root = TreeNode(1)
        inverted = invertTree(root)
        self.assertEqual(self.treeToList(inverted), [1])

        # Test case 3: Tree with two levels
        root = TreeNode(1)
        root.left = TreeNode(2)
        root.right = TreeNode(3)
        inverted = invertTree(root)
        self.assertEqual(self.treeToList(inverted), [1, 3, 2])

        # Test case 4: Tree with three levels
        root = TreeNode(1)
        root.left = TreeNode(2)
        root.right = TreeNode(3)
        root.left.left = TreeNode(4)
        root.left.right = TreeNode(5)
        root.right.left = TreeNode(6)
        root.right.right = TreeNode(7)
        inverted = invertTree(root)
        self.assertEqual(self.treeToList(inverted), [1, 3, 2, 7, 6, 5, 4])

if __name__ == '__main__':
    unittest.main()
