export function generateQuestion() {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '*', '/'];
    const op = operators[Math.floor(Math.random() * operators.length)];

    let answer;
    let question;

    switch(op) {
        case '+':
            answer = a + b;
            question = `${a} + ${b} = ?`;
            break;
        case '-':
            answer = a - b;
            question = `${a} - ${b} = ?`;
            break;
        case '*':
            answer = a * b;
            question = `${a} * ${b} = ?`;
            break;
        case '/':
            const dividend = a * b;
            answer = dividend / b;
            question = `${dividend} / ${b} = ?`;
            break;
    }

    return {
        questionId: Date.now().toString(),
        question,
        correctAnswer: answer,
        createdAt: new Date().toISOString()
    };
}
