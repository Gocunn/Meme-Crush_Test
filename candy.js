// Danh sách các loại kẹo
var candies = ["Furina - Red", "Nahida - Or", "Neuvillet - Green", "Raiden - Yellow", "Venti - Blue", "Zhongli - Purple"];

// Ma trận chứa bảng trò chơi
var board = [];

// Số hàng và cột của bảng trò chơi
var rows = 9;
var columns = 9;

// Hàm được gọi khi trang web được tải
window.onload = function() {
    startGame(); // Bắt đầu trò chơi

    // Lặp lại các hành động trong trò chơi sau mỗi khoảng thời gian nhất định
    window.setInterval(function(){
        crushCandy(); // Nghiền kẹo
        slideCandy(); // Trượt kẹo
        generateCandy(); // Tạo mới kẹo
    }, 100);

    handleEvents(); // Xử lý sự kiện cho cảm ứng và click
}

// Hàm này tạo bảng trò chơi
function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./Image/" + randomCandy() + ".png";
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// Hàm này chọn ngẫu nhiên một loại kẹo từ danh sách candies
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Hàm này xử lý việc "nghiền" kẹo
function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
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

// Hàm này tạo ngẫu nhiên hình ảnh kẹo ở hàng đầu tiên nếu có ô trống
function generateCandy() {
    // Tạo kẹo mới ở hàng đầu tiên nếu có ô trống
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./Image/" + randomCandy() + ".png";
        }
    }
}

// Hàm này xử lý sự kiện cho cảm ứng và click
function handleEvents() {
    if (isTouchDevice()) {
        // Xử lý sự kiện cảm ứng cho điện thoại
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = board[r][c];
                tile.addEventListener("touchstart", handleTouchStart);
            }
        }
    } else {
        // Xử lý sự kiện click cho máy tính
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = board[r][c];
                tile.addEventListener("click", handleClick);
            }
        }
    }
}

// Hàm này xác định xem thiết bị có hỗ trợ cảm ứng hay không
function isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
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
