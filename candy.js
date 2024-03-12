var candies = ["Furina - Red", "Nahida - Or", "Neuvillet - Green", "Raiden - Yellow", "Venti - Blue", "Zhongli - Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var currTile;
var otherTile;

// Hàm này được gọi khi trang web được tải
window.onload = function() {
    startGame(); // Bắt đầu trò chơi

    // Lặp lại các hành động trong trò chơi sau mỗi khoảng thời gian nhất định
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);

    // Xử lý sự kiện theo chuột hoặc cảm ứng tùy theo thiết bị
    if (isTouchDevice()) {
        handleTouchEvents(); // Xử lý sự kiện cảm ứng cho điện thoại
    } else {
        handleMouseEvents(); // Xử lý sự kiện click cho máy tính
    }
}

// Hàm này được gọi khi bắt đầu trò chơi
function startGame() {
    // Tạo ma trận ô vuông và gán hình ảnh kẹo cho từng ô
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./Image/" + randomCandy() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// Hàm này được gọi khi một ô bắt đầu được kéo
function dragStart() {
    currTile = this;
}

// Hàm này được gọi khi một ô được kéo qua
function dragOver(e) {
    e.preventDefault();
}

// Hàm này được gọi khi một ô kéo vào
function dragEnter(e) {
    e.preventDefault();
}

// Hàm này được gọi khi một ô kéo rời đi
function dragLeave() {
}

// Hàm này được gọi khi một ô được thả vào
function dragDrop() {
    otherTile = this;
}

// Hàm này được gọi khi một ô kéo kết thúc
function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;
    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;
    
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

// Hàm này kiểm tra và xử lý việc "nghiền" kẹo
function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

// Hàm này kiểm tra và "nghiền" các cụm kẹo có ba phần tử giống nhau
function crushThree() {
    // Kiểm tra hàng ngang
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./Image/blank.png";
                candy2.src = "./Image/blank.png";
                candy3.src = "./Image/blank.png";
                score += 20;
            }
        }
    }

    // Kiểm tra cột dọc
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./Image/blank.png";
                candy2.src = "./Image/blank.png";
                candy3.src = "./Image/blank.png";
                score += 20;
            }
        }
    }
}

// Hàm này kiểm tra xem có nước đi hợp lệ nào không
function checkValid() {
    // Kiểm tra hàng ngang
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Kiểm tra cột dọc
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

// Hàm này xử lý việc trượt các viên kẹo khi có ô trống
function slideCandy() {
    // Trượt các viên kẹo xuống dưới khi có ô trống
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        // Đặt các ô trống ở trên cùng
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./Image/blank.png";
        }
    }
}

// Hàm này tạo ngẫu nhiên hình ảnh kẹo
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

// Hàm này tạo ngẫu nhiên hình ảnh kẹo
function generateCandy() {
    // Tạo kẹo mới ở hàng đầu tiên nếu có ô trống
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./Image/" + randomCandy() + ".png"; 
        }
    }
}

// Hàm này xác định xem thiết bị có hỗ trợ cảm ứng hay không
function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

// Hàm này xử lý sự kiện click cho máy tính
function handleMouseEvents() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            tile.addEventListener("click", handleClick);
        }
    }
}

// Xử lý sự kiện click cho máy tính
function handleMouseEvents() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            tile.addEventListener("click", handleClick);
        }
    }
}

// Xử lý sự kiện cảm ứng cho điện thoại
function handleTouchEvents() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            tile.addEventListener("touchstart", handleTouchStart);
        }
    }
} 

// Hàm này được gọi khi một ô được click
function handleClick() {
    // Lấy vị trí của ô click
    let tileId = this.id;
    let coordinates = tileId.split("-");
    let row = parseInt(coordinates[0]);
    let col = parseInt(coordinates[1]);

    // Thực hiện xử lý cho ô click ở đây
    console.log("Clicked on row " + row + " and column " + col);
}

// Hàm này được gọi khi một ô touch kết thúc
function handleTouchStart(event) {
    // Ngăn chặn hành vi mặc định của trình duyệt
    event.preventDefault();

    // Lấy vị trí của ô được chạm
    let touch = event.changedTouches[0];
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    let tileId = targetElement.id;
    let coordinates = tileId.split("-");
    let row = parseInt(coordinates[0]);
    let col = parseInt(coordinates[1]);

    // Thực hiện xử lý cho ô được chạm ở đây
    console.log("Touched at row " + row + " and column " + col);
}

