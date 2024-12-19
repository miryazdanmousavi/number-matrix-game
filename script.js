/* 
    بازی حدس ماتریکس اعداد
    پیدا کردن بزرگترین حاصل ضرب ممکن، به صورت افقی و عمودی و قطری
*/

let matrixSize = 4;
let maxSize = 10;
let attempts = 3;
let currentAttempts = attempts;
let gameMatrix = [];
let currentLevel = 1;

// to generate a random number between 1 and 100
const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

// Function to convert numbers to Persian
function toPersianNumber(num) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .split("")
    .map((digit) => persianNumbers[digit])
    .join("");
}

// Function to create the game matrix
function createMatrix(size) {
  gameMatrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, getRandomNumber)
  );
}

// Function to render the game matrix
function renderMatrix() {
  const container = document.getElementById("game-container");
  container.innerHTML = "";
  const table = document.createElement("table");
  table.classList.add("matrix-table");

  gameMatrix.forEach((row, i) => {
    const tr = document.createElement("tr");
    row.forEach((cell, j) => {
      const td = document.createElement("td");
      td.textContent = toPersianNumber(cell); // Convert cell number to Persian
      td.classList.add("matrix-cell");
      td.dataset.row = i;
      td.dataset.col = j;
      td.addEventListener("click", () => handleCellClick(i, j));
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);
  updateStatusDisplay();
}

// Track selected cells
let selectedCells = [];

// Function to handle cell click
function handleCellClick(row, col) {
  const cellElement = document.querySelector(
    `[data-row='${row}'][data-col='${col}']`
  );

  // Toggle selection state
  const cellIndex = selectedCells.findIndex(
    (cell) => cell.row === row && cell.col === col
  );
  if (cellIndex !== -1) {
    // If already selected, deselect it
    selectedCells.splice(cellIndex, 1);
    cellElement.classList.remove("selected");
    return;
  }

  // Add cell to selected cells and mark it as selected
  selectedCells.push({ row, col });
  cellElement.classList.add("selected");

  // Check if selection is valid and sufficient
  if (selectedCells.length === 4) {
    if (isValidSelection()) {
      const result = calculateProduct();
      if (isWinningCombination(result)) {
        alert(`😀تبریک شما برنده شدید! رفتی مرحله بعد`);
        nextLevel();
      } else {
        currentAttempts--;
        updateStatusDisplay(); // Update attempts display immediately
        if (currentAttempts > 0) {
          alert(
            `اشتباه حدس زدی، شانس های باقی مانده: ${toPersianNumber(
              currentAttempts
            )}`
          );
          resetSelection(); // Reset selection after an incorrect attempt
        } else {
          alert("متاسفانه باختی😭، برگشتی مرحله 1");
          restartGame();
        }
      }
    } else {
      alert(
        "محدوده ی انتخابی غیر مجاز است. شما فقط می توانید 4 خانه ی کنار هم به صورت افقی و عمودی و قطری انتخاب کنید، همچنین انتخاب مربعی غیر مجاز است"
      );
      resetSelection();
    }
  }
}

// Function to validate selected cells
function isValidSelection() {
  const rows = selectedCells.map((cell) => cell.row);
  const cols = selectedCells.map((cell) => cell.col);

  const isHorizontal = rows.every((r) => r === rows[0]) && isConsecutive(cols);
  const isVertical = cols.every((c) => c === cols[0]) && isConsecutive(rows);
  const isDiagonal = isDiagonalSelection(rows, cols);

  return isHorizontal || isVertical || isDiagonal;
}

// Check if numbers are consecutive
function isConsecutive(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.slice(1).every((v, i) => v === sorted[i] + 1);
}

// Check if selection is diagonal
function isDiagonalSelection(rows, cols) {
  const sortedRows = [...rows].sort((a, b) => a - b);
  const sortedCols = [...cols].sort((a, b) => a - b);
  const diffRow = sortedRows[1] - sortedRows[0];
  const diffCol = sortedCols[1] - sortedCols[0];
  return (
    diffRow === diffCol &&
    isConsecutive(sortedRows) &&
    isConsecutive(sortedCols)
  );
}

// Calculate the product of selected cells
function calculateProduct() {
  return selectedCells.reduce(
    (product, cell) => product * gameMatrix[cell.row][cell.col],
    1
  );
}

// Check if the selection is the winning combination
function isWinningCombination(result) {
  let maxProduct = -Infinity;

  // Calculate maxProduct for horizontal, vertical, and diagonal combinations
  for (let i = 0; i < gameMatrix.length; i++) {
    for (let j = 0; j < gameMatrix.length - 3; j++) {
      maxProduct = Math.max(
        maxProduct,
        gameMatrix[i][j] *
          gameMatrix[i][j + 1] *
          gameMatrix[i][j + 2] *
          gameMatrix[i][j + 3]
      );
    }
  }

  for (let i = 0; i < gameMatrix.length - 3; i++) {
    for (let j = 0; j < gameMatrix.length; j++) {
      maxProduct = Math.max(
        maxProduct,
        gameMatrix[i][j] *
          gameMatrix[i + 1][j] *
          gameMatrix[i + 2][j] *
          gameMatrix[i + 3][j]
      );
    }
  }

  for (let i = 0; i < gameMatrix.length - 3; i++) {
    for (let j = 0; j < gameMatrix.length - 3; j++) {
      maxProduct = Math.max(
        maxProduct,
        gameMatrix[i][j] *
          gameMatrix[i + 1][j + 1] *
          gameMatrix[i + 2][j + 2] *
          gameMatrix[i + 3][j + 3]
      );
    }
  }

  return result === maxProduct;
}

// Move to the next level
function nextLevel() {
  if (matrixSize < maxSize) {
    matrixSize++;
    currentAttempts = attempts;
    currentLevel++;
    createMatrix(matrixSize);
    renderMatrix();
    resetSelection();
    updateStatusDisplay(); // Ensure status display updates on level change
  } else {
    alert("تبریک شما تمام مراحل بازی را کامل کردید🤩حالا از اول شروع کن");
    restartGame();
  }
}

// Restart the game
function restartGame() {
  matrixSize = 4;
  currentAttempts = attempts;
  currentLevel = 1;
  createMatrix(matrixSize);
  renderMatrix();
  resetSelection();
  updateStatusDisplay(); // Ensure status display updates on restart
}

// Reset the selection
function resetSelection() {
  selectedCells = [];
  document.querySelectorAll(".matrix-cell.selected").forEach((cell) => {
    cell.classList.remove("selected");
  });
}

// Update the status display (level and attempts)
function updateStatusDisplay() {
  const statusContainer = document.getElementById("status-container");
  statusContainer.textContent = `سطح: ${toPersianNumber(
    currentLevel
  )} (●'◡'●) شانس باقی مانده: ${toPersianNumber(currentAttempts)}`;
}

// Initialize the game
window.onload = function () {
  const statusContainer = document.createElement("div");
  statusContainer.id = "status-container";
  document.body.insertBefore(
    statusContainer,
    document.getElementById("game-container")
  );

  createMatrix(matrixSize);
  renderMatrix();
};
