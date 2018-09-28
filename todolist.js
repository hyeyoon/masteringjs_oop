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
  constructor() {
    this.todos = [];
    this.currentId = 0;
    this.order = [];
    this.utils = new Utils();
  }
  command(userCommand) {
    const utils = this.utils;
    this.order = utils.splitList(userCommand).map((item) => {
      return utils.arrangeText(item);
    })
    this.runCommand();
  }
  runCommand() {
    const [order] = this.order;
    switch (order) {
    	case "add":
      	this.add();
        break;
      case "show":
      	this.show();
        break;
      case "update":
      	this.update();
        break;
      default: 
      	console.log('유효한 명령을 입력하세요.');
    }
  }
};

const Utils = class {
  constructor() {
    this.seperator = '$'
  }
  splitList(list) {
    return list.split(this.seperator);
  }
  arrangeText(str) {
    return str.trim().toLowerCase();
  }
}

const todo = new Todo();
console.log('todo:', todo);
todo.command("add$    자바스크립트 공부하기");
// todo.command("shOW     $doing");
// todo.command("update$0$done");
// todo.command("show$done");
