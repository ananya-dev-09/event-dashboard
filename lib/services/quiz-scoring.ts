export function scoreQuiz(answers: string[], correctAnswers: string[], marks: number[], negativeMarks: number[] = []) {
  return answers.reduce((total, answer, idx) => {
    if (answer === correctAnswers[idx]) return total + (marks[idx] ?? 0);
    return total - (negativeMarks[idx] ?? 0);
  }, 0);
}
