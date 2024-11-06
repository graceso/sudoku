/**
 * Sudoku
 *
 */

/* ===========================
   HTML structure
   =========================== */

function generateSudokuHtml() {
  // Create main container
  const container = document.createElement("div")
  container.id = "sudoku-container"
  container.style.display = "flex"
  container.style.flexDirection = "column"
  container.style.alignItems = "center"
  container.style.justifyContent = "center"
  container.style.minHeight = "100vh"
  container.style.backgroundColor = "#f0f0f0"
  container.style.fontFamily = "sans-serif"

  // Title
  const title = document.createElement("h1")
  title.innerText = "Sudoku"
  title.style.marginBottom = "17px"
  container.appendChild(title)

  // Sudoku grid
  const grid = document.createElement("div")
  grid.id = "sudoku-grid"
  grid.style.display = "grid"
  grid.style.gridTemplateColumns = "repeat(9, 50px)"
  grid.style.gridTemplateRows = "repeat(9, 50px)"
  grid.style.gap = "2px"
  grid.style.border = "2px solid #000"
  grid.style.backgroundColor = "#fff"
  grid.style.padding = "5px"
  container.appendChild(grid)

  // Button container
  const buttonsContainer = document.createElement("div")
  buttonsContainer.style.marginTop = "20px"
  buttonsContainer.style.display = "flex"
  buttonsContainer.style.gap = "10px"

  // New game button
  const newGameButton = document.createElement("button")
  newGameButton.id = "new-game"
  newGameButton.innerText = "New game"
  newGameButton.style.padding = "10px 20px"
  buttonsContainer.appendChild(newGameButton)

  // Validate button
  const validateButton = document.createElement("button")
  validateButton.id = "validate"
  validateButton.innerText = "Validate"
  validateButton.style.padding = "10px 20px"
  buttonsContainer.appendChild(validateButton)

  // Hint button
  const hintButton = document.createElement("button")
  hintButton.id = "hint"
  hintButton.innerText = "Hint"
  hintButton.style.padding = "10px 20px"
  buttonsContainer.appendChild(hintButton)

  container.appendChild(buttonsContainer)

  // Message display
  const message = document.createElement("div")
  message.id = "message"
  message.style.marginTop = "20px"
  message.style.fontSize = "18px"
  message.style.height = "24px"
  container.appendChild(message)

  document.body.appendChild(container)
}

/* ===========================
   CSS styling
   =========================== */

function styleSudokuGrid() {
  const grid = document.getElementById("sudoku-grid")
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("input")
      cell.type = "text"
      cell.maxLength = "1"
      cell.style.width = "46px"
      cell.style.height = "46px"
      cell.style.textAlign = "center"
      cell.style.fontSize = "18px"
      cell.style.border = "1px solid #999"
      cell.id = `cell-${row}-${col}`
      cell.dataset.row = row
      cell.dataset.col = col
      
      if (col % 3 === 0) {
        cell.style.borderLeft = "2px solid #000"
      }
      if (row % 3 === 0) {
        cell.style.borderTop = "2px solid #000"
      }
      if (col === 8) {
        cell.style.borderRight = "2px solid #000"
      }
      if (row === 8) {
        cell.style.borderBottom = "2px solid #000"
      }
      grid.appendChild(cell)
    }
  }
}

/* ===========================
   Sudoku puzzle generation
   =========================== */

function generateCompletePuzzle() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0))

  function isSafe(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false
    }
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false
    }
    // Check 3x3 subgrid
    const startRow = row - (row % 3)
    const startCol = col - (col % 3)
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[startRow + i][startCol + j] === num) return false
    return true
  }

  function solve(grid) {
    for (let row = 0; row < 9; row++)
      for (let col = 0; col < 9; col++)
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num
              if (solve(grid)) return true
              grid[row][col] = 0
            }
          }
          return false
        }
    return true
  }

  solve(grid)
  return grid
}

/**
 * Removes numbers from the complete puzzle to create the Sudoku puzzle.
 * The number of removals determines the difficulty level.
 * @param {number[][]} grid - A complete 9x9 Sudoku grid.
 * @param {number} removals - Number of cells to clear.
 * @returns {number[][]} The Sudoku puzzle with some cells cleared.
 */
function removeNumbers(grid, removals = 40) {
  const puzzle = grid.map((row) => row.slice())
  while (removals > 0) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removals--
    }
  }
  return puzzle
}

/* ===========================
   Sudoku game logic
   =========================== */

/**
 * Initializes the Sudoku game by generating a puzzle and rendering it on the grid.
 */
function initialiseGame() {
  const completePuzzle = generateCompletePuzzle()
  const puzzle = removeNumbers(completePuzzle, 40)
  renderPuzzle(puzzle)
  attachEventListeners(completePuzzle)
}

/**
 * Renders the Sudoku puzzle on the grid by populating the input fields.
 * @param {number[][]} puzzle - The Sudoku puzzle grid with some cells cleared.
 */
function renderPuzzle(puzzle) {
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      const cell = document.getElementById(`cell-${row}-${col}`)
      cell.value = puzzle[row][col] !== 0 ? puzzle[row][col] : ""
      if (puzzle[row][col] !== 0) {
        cell.disabled = true
        cell.style.backgroundColor = "#D8E2DC"
        cell.style.fontWeight = "bold"
      } else {
        cell.disabled = false
        cell.style.backgroundColor = "#fff"
        cell.style.fontWeight = "normal"
      }
    }
  document.getElementById("message").innerText = ""
}

/**
 * Attaches event listeners to control buttons for game interactions.
 * @param {number[][]} solution - The complete solution grid for validation and hints.
 */
function attachEventListeners(solution) {
  document.getElementById("new-game").addEventListener("click", () => {
    initialiseGame()
  })

  document.getElementById("validate").addEventListener("click", () => {
    const isValid = validatePuzzle(solution)
    const message = document.getElementById("message")
    if (isValid) {
      message.style.color = "green"
      message.innerText = "Congrats! You solved the sudoku correctly."
    } else {
      message.style.color = "red"
      message.innerText = "There are errors in your solution. Please try again."
    }
  })

  document.getElementById("hint").addEventListener("click", () => {
    provideHint(solution)
  })
}

/**
 * Validates the current state of the puzzle against the solution.
 * @param {number[][]} solution - The complete solution grid.
 * @returns {boolean} True if the puzzle is correctly solved, else false.
 */
function validatePuzzle(solution) {
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      const cell = document.getElementById(`cell-${row}-${col}`)
      if (cell.value === "" || parseInt(cell.value) !== solution[row][col]) {
        return false
      }
    }
  return true
}

/**
 * Provides a hint by filling in one empty cell with the correct number.
 * @param {number[][]} solution - The complete solution grid.
 */
function provideHint(solution) {
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      const cell = document.getElementById(`cell-${row}-${col}`)
      if (cell.value === "") {
        cell.value = solution[row][col]
        cell.style.backgroundColor = "#d1ffd1"
        return
      }
    }
  const message = document.getElementById("message")
  message.style.color = "blue"
  message.innerText = "No more hints available."
}

/* ===========================
   Initialisation
   =========================== */

/**
 * Initialises the Sudoku game by generating the HTML, styling it,
 * and setting up the game logic.
 */
function setupSudokuGame() {
  generateSudokuHtml()
  styleSudokuGrid()
  initialiseGame()
}

// Start the Sudoku game when the window loads
window.onload = setupSudokuGame
