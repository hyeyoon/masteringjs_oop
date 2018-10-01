/********************
 * TODOLIST 만들기
 ********************
 *  [requirements]
 *  - 할일을 추가할 수 있다.
 *  - 할일이 추가되면 id 값을 생성하고 결과를 알려준다.
 *  - 상태는 3가지로 관리된다. todo, doing, done.
 *  - 각 일(task)는 상태값을 가지고 있고, 그 상태값을 변경할 수 있다.
 *  - 각 상태에 있는 task는 show함수를 통해서 볼 수 있다.
 *  - 명령어를 입력시 command함수를 사용해야하고, '$'를 구분자로 사용해서 넣는다.
 *  - done의 경우 소요시간이 함께 표시된다 (소요시간은 doing에서 done까지의 시간이다)
 *  - 구분자($) 사이에 공백이 있다면 공백을 제거하고 실행되도록 한다.
 *  - 대/소문자입력은 프로그램에서는 소문자만 처리하도록 코드를 구현한다. (대문자는 소문자로 변경)
 *  - 유효하지 않은 입력은 오류를 발생시킨다.
 *  - code 형태는 es class를 기반으로 개발한다.
 */

const Todo = class {
  constructor(utils) {
    this.todos = [];
    this.currentId = 0;
    this.order = [];
    this.utils = utils;
    this.statusList = ['todo', 'doing', 'done'];
    // this.defaultStatusCount = {todo: 0, doing: 0, done: 0};
  }
  command(userCommand) {
    const utils = this.utils;
    this.order = utils.splitList(userCommand).map((item) => {
      return utils.formatText(item);
    })
    this.runCommand(this.order);
  }
  runCommand(orderList) {
    const [order] = orderList;
    switch (order) {
    	case "add":
      	this.addTodo();
        break;
      case "show":
      	this.showTodo();
        break;
      case "update":
      	this.updateTodo();
        break;
      default: 
      	console.error('유효한 명령을 입력하세요.');
    }
  }
  addTodo() {
  	const task = new Task(this.currentId, this.order[1]);
    this.todos.push(task);
    this.currentId++;
		console.log(`id: ${task.id}, "${task.task}" 항목이 추가되었습니다.`);
    this.printCurrentStatus();
  }
  showTodo() {
    const status = this.order[1];
    const formattedTodos = this.todos.filter(todo => todo.status === status).reduce(this.formatTodos.bind(this), []);
    if (formattedTodos.length) {
      console.log(formattedTodos.join(", "));
    } else {
      console.error(`${status} 상태의 작업이 없습니다.`);
    }
  }
  updateTodo() {
  	const [currentStatus, id, orderStatus] = this.order;
    const index = this.todos.findIndex(todo => todo.id === Number(id));
    if (index >= 0) {
      this.handleDateTime(index, orderStatus)
    } else {
      console.error('유효한 명령을 입력하세요.');
      return;
    };
    this.printCurrentStatus();
  }
  formatTodos(accumulator, currentValue) {
    const status = this.order[1];
    if (status === 'done') {
      accumulator.push(`"${currentValue.id}, ${currentValue.task}, ${this.calcTime(currentValue)}"`);
    } else if (status === 'doing' || status === 'todo') {
      accumulator.push(`"${currentValue.id}, ${currentValue.task}"`);
    } 
    return accumulator;
  }
  calcTime(todo) {
    const diff = Math.abs((todo.endAt - todo.startAt) / 1000);
    const diffDays = Math.floor(diff / 86400);
    const diffHours = Math.floor(diff / 3600) % 24;
    const diffMinutes = Math.floor(diff / 60) % 60;
    const diffSeconds = Math.floor(diff % 60);
    return `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 ${diffSeconds}초`
  }
  printCurrentStatus() {
    // const countStatus = this.todos.reduce((accumulator, currentValue) => {
    //   accumulator[currentValue.status] = ++accumulator[currentValue.status] || 1;
    //   return accumulator;
    // }, this.defaultStatusCount);
    // const currentStatus = Object.getOwnPropertyNames(countStatus).map((item) => `${item}: ${countStatus[item]}개`);
    // console.log('현재상태 :', currentStatus.join(", "));

    const currentStatus = this.statusList.reduce((accumulator, currentValue) => {
      const task = this.todos.filter(item => item.status === currentValue);
      accumulator.push(`${currentValue}: ${task.length}개`);
      return accumulator;
    }, [])
    console.log('현재상태 :', currentStatus.join(", "));
  }
  handleDateTime(index, status) {
    switch (status) {
      case "doing":
        this.todos[index].status = status;
      	this.addDateTime(index, 'startAt');
        break;
      case "done":
        this.todos[index].status = status;
      	this.addDateTime(index, 'endAt');
        break;
      default: 
      	console.error('유효한 명령을 입력하세요.');
    }
  }
  addDateTime(index, key) {
    this.todos[index][key] = new Date();
  }
};

const Utils = class {
  constructor() {
    this.seperator = '$'
  }
  splitList(list) {
    return list.split(this.seperator);
  }
  formatText(str) {
    return str.trim().toLowerCase();
  }
}

const Task = class {
  constructor(itemId, task) {
    this.id = itemId;
    this.status = 'todo';
    this.task = task;
    this.startAt = null;
    this.endAt = null;
  }
}

const todo = new Todo(new Utils());

// Test Case
todo.command("add$    자바스크립트 공부하기");
todo.command("add$    Study");
todo.command("add$    TEST");
todo.command("shOW     $todo");
todo.command("update$0$doing");
todo.command("shOW     $doing");
setTimeout(() => {
  todo.command("update$0$done");
  todo.command("show$done");
}, 5000)