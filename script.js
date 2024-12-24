let matrixSize = 4;
let maxSize = 10;
let attempts = 3;
let currentAttempts = attempts;
let gameMatrix = [];
let currentLevel = 1;

const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

function toPersianNumber(num) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .split("")
    .map((digit) => persianNumbers[digit])
    .join("");
}

function createMatrix(size) {
  gameMatrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, getRandomNumber)
  );
}

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

let selectedCells = [];

function handleCellClick(row, col) {
  const cellElement = document.querySelector(
    `[data-row='${row}'][data-col='${col}']`
  );

  const cellIndex = selectedCells.findIndex(
    (cell) => cell.row === row && cell.col === col
  );
  if (cellIndex !== -1) {
    // If already selected, deselect it
    selectedCells.splice(cellIndex, 1);
    cellElement.classList.remove("selected");
    return;
  }

  selectedCells.push({ row, col });
  cellElement.classList.add("selected");

  if (selectedCells.length === 4) {
    if (isValidSelection()) {
      const result = calculateProduct();
      if (isWinningCombination(result)) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "تبریک شما برنده شدید! رفتی مرحله بعد",
        });
        nextLevel();
      } else {
        currentAttempts--;
        updateStatusDisplay();
        if (currentAttempts > 0) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "error",
            title: `اشتباه حدس زدی شانس های باقی مانده : ${toPersianNumber(
              currentAttempts
            )}`,
          });

          resetSelection();
        } else {
          if (matrixSize == 4) {
            Swal.fire({
              title: "!متاسفانه باختی همین اول کاری",
              icon: "error",
              draggable: true,
            });
          } else {
            Swal.fire({
              title: "!متاسفانه باختی برگشتی مرحله ی اول",
              icon: "error",
              draggable: true,
            });
          }
          restartGame();
        }
      }
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "warning",
        title:
          "محدوده ی انتخابی غیر مجاز است. شما فقط می توانید 4 خانه ی کنار هم به صورت افقی و عمودی و قطری انتخاب کنید، همچنین انتخاب مربعی غیر مجاز است",
      });
      resetSelection();
    }
  }
}

function isValidSelection() {
  const rows = selectedCells.map((cell) => cell.row);
  const cols = selectedCells.map((cell) => cell.col);

  const isHorizontal = rows.every((r) => r === rows[0]) && isConsecutive(cols);
  const isVertical = cols.every((c) => c === cols[0]) && isConsecutive(rows);
  const isDiagonal = isDiagonalSelection(rows, cols);

  return isHorizontal || isVertical || isDiagonal;
}

function isConsecutive(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted.slice(1).every((v, i) => v === sorted[i] + 1);
}

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

function calculateProduct() {
  return selectedCells.reduce(
    (product, cell) => product * gameMatrix[cell.row][cell.col],
    1
  );
}

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

function nextLevel() {
  if (matrixSize < maxSize) {
    matrixSize++;
    currentAttempts = attempts;
    currentLevel++;
    createMatrix(matrixSize);
    renderMatrix();
    resetSelection();
    updateStatusDisplay();
  } else {
    Swal.fire({
      title:
        "تبریک! تمام مراحل بازی رو با موفقیت تموم کردی، حالا از اول شروع کن",
      icon: "success",
      draggable: true,
    });
    restartGame();
  }
}

function restartGame() {
  matrixSize = 4;
  currentAttempts = attempts;
  currentLevel = 1;
  createMatrix(matrixSize);
  renderMatrix();
  resetSelection();
  updateStatusDisplay();
}

function resetSelection() {
  selectedCells = [];
  document.querySelectorAll(".matrix-cell.selected").forEach((cell) => {
    cell.classList.remove("selected");
  });
}

function updateStatusDisplay() {
  const statusContainer = document.getElementById("status-container");
  statusContainer.textContent = `سطح: ${toPersianNumber(
    currentLevel
  )} (●'◡'●) شانس باقی مانده: ${toPersianNumber(currentAttempts)}`;
}

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
