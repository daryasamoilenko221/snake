//в первую очредь объявим все переменные, которые пригодятся нам в будущем
let scoreBlock;   //отвечает за отображение на странице очков
let score = 0;   //это наши очки внутри игры

const config = {    //содержит настройки игры
	step: 0,
	maxStep: 6,   //step и maxStep для того что бы пропускать игровой цикл
	sizeCell: 16,  //размер одной ячейки
	sizeBerry: 16 / 4   //размер ягоды
}

const snake = {  //gfhfhgfvj
	x: 160,  
	y: 160,  // x и y это координаты
	dx: config.sizeCell,
	dy: 0,       // dx и dy это скорость по вертикали и горизонтали
	tails: [],  //это массив ячеек под контролем нашей змейки
	maxTails: 3  //кол-во ячеек самой змейки
}	

let berry = {   //хронит координаты ягоды
	x: 0,
	y: 0
}

//получим canvas и пропишем игровой цикл
let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore();


function gameLoop() { 

	requestAnimationFrame (gameLoop);  //т.о. игровой цикл будет вызываться бесконечно
	if ( ++config.step < config.maxStep ) {
		return; //за счет этого условия мы можем контролировать скорость отрисовки на экране
	}
	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height); //каждый кадр очищает canvas и заново отрисовыват элементы(змейка и ягода)
	
	drawBerry();
	drawSnake();

}

requestAnimationFrame (gameLoop);

function drawSnake(){
	snake.x += snake.dx;  //меняем координаты змейки согласно скорости
	snake.y += snake.dy;

	collisionBorder();
	
	snake.tails.unshift( { x: snake.x, y: snake.y } ); //unshift добавляет в начало массива объект с х и у координатами
	
	if ( snake.tails.length > snake.maxTails ) {  //условие: если кол-во дочерних эл-ов у змейки больше чем разрешено, то удаляем последний эл-т
		snake.tails.pop();
	};
	
	snake.tails.forEach( function(el, index){  //с помощью метода forEach мы перебираем все дочерние эл-ты змейки и отрисовываем их, проверяя на соприкосновение друг с другом и с ягодой
		if (index == 0) {
			context.fillStyle = "#faa105";  //с начала голова змейки яркого цвета
		} else {
			context.fillStyle = "#f7e30f";   //остальное тело тусклый цвет
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );
		 
		//проверяем совпадают ли координаты змейки и ягоды
		if ( el.x === berry.x && el.y === berry.y ) {
			snake.maxTails++;  //если они совпадают, то увеличиваем хвост у змейки
			incScore();   //увеличиваем очки
			randomPositionBerry(); //и создаем новую ягоду
		}

		//проверяем на соприкосновении змейки с хвостом
		for( let i = index + 1; i < snake.tails.length; i++ ) {
			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) { //если координаты совпали то запускаем гру занаво
				refreshGame();
			}
		}
	});
}


function collisionBorder(){  //условие задачи, что змейка должна отрисовываться на противоположной стороне, когда подойдет к краю
	//для этого делаем простую проверку координат змейки, и если она уходит за границы, меняем их
	if ( snake.x < 0 ) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width) {
		snake.x = 0;
	}

	if ( snake.y < 0 ) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height) {
		snake.y = 0;
	}
	
}

function refreshGame() {  //пропишем, когда змейка съест саму себя
	score = 0;
	drawScore();

	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry();
}


function drawBerry() {   //отвечает за рисование ягоды
	context.beginPath();
	//назначаем цвет и окружность на основе нужных координат ягоды
	context.fillStyle = "#A00034";
	context.arc ( berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
	context.fill();
}

function randomPositionBerry() {  //ф-ция назначения координат ягоды
	//в ф-цию рандома передаем 0 и кол-во ячеек(деление ширины канваса на размер ячейки)
	berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;  //полученный результат необх-одимо умножить на размер ячейки
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function incScore() { //функция для обработки очков
	score++;    // увеличивает число очков на единицу
	drawScore();   
}

function drawScore() {
	scoreBlock.innerHTML = score;  // отоброжение на странице
}


function getRandomInt(min, max) {   //принимает диапазон чисел и возвращает рандомное значение в заданном диапазоне
	return Math.floor( Math.random() * (max - min) + min );
}

document.addEventListener ("keydown", function(e) {    //управление: вешаем обработчик на клавиши  и определяем какую клавишу нажали
	if ( e.code == "KeyW" ) {     //проверяем е код, который вернет код клавши
		snake.dy = -config.sizeCell;   //после нажатия меняем направление у змейки, учитывая что она движется постоянно, меняем положение с положительного на отрицательное и наоборот
		snake.dx = 0;  //помимо того, что сменили движение, необходимо обнулить движение по горизонтали или вертикали
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
}); 