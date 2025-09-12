import p5 from 'p5';
import { Asteroid } from '../asteroid.class';
import { GameWord } from './model';

export class Game {
  score = 0;
  lives = 2;
  gameState: 'waiting' | 'playing' | 'gameOver' = 'waiting';
  currentWord!: GameWord;
  asteroid!: Asteroid;

  feedbackMessage = "";
  feedbackTimer = 0;

  constructor(
    private p: p5,
    private wordList: GameWord[],
    private inputField: p5.Element,
    private onGameOver: () => void,
  ) {
    this.reset();
  }

  reset(): void {
    this.score = 0;
    this.lives = 2;
    this.gameState = 'playing';
    this.feedbackTimer = 0;
    this.inputField.show();
    this.inputField.value('');
    (this.inputField.elt as HTMLInputElement).focus();
    this.newRound();
  }

  newRound(): void {
    this.currentWord = this.p.random(this.wordList);
    const speed = 1.5 + this.score * 0.2;
    this.asteroid = new Asteroid(this.p, speed);
    this.inputField.value('');
  }

  checkAnswer(): void {
    if (this.gameState !== 'playing') return;
    const userAnswer = (this.inputField.value() as string).toLowerCase().trim();
    const correctAnswer = this.currentWord.en.toLowerCase().trim();
    if (userAnswer === correctAnswer) {
      this.score++;
      this.showFeedback(`${this.currentWord.ua} - ${this.currentWord.en}`);
      this.newRound();
    }
  }

  update(): void {
    if (this.gameState === 'playing') {
      this.asteroid.update();
      this.checkCollision();
    }
  }

  draw(): void {
    if (this.gameState === 'playing') {
      this.asteroid.draw();
      this.drawUI();
      this.drawFeedback();
    } else if (this.gameState === 'gameOver') {
      this.drawGameOverScreen();
    } else if (this.gameState === 'waiting') {
      this.drawWaitingScreen();
    }
  }

  private checkCollision(): void {
    if (this.asteroid.y + this.asteroid.size / 2 > (this.inputField.elt as HTMLElement).offsetTop) {
      this.lives--;
      this.showFeedback(`${this.currentWord.ua} - ${this.currentWord.en}`);
      if (this.lives <= 0) {
        this.gameState = 'gameOver';
        this.inputField.hide();
        this.onGameOver();
      } else {
        this.newRound();
      }
    }
  }

  private drawUI(): void {
    this.p.fill(255);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.textSize(24);
    this.p.text(`Score: ${this.score}`, 20, 20);
    this.p.textAlign(this.p.RIGHT, this.p.TOP);
    this.p.text(`Lives: ${this.lives}`, this.p.width - 20, 20);
    this.p.fill(255, 220, 100);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(32);
    this.p.text(this.currentWord.ua, this.p.width / 2, 80);
  }

  private showFeedback(message: string): void {
    this.feedbackMessage = message;
    this.feedbackTimer = 180;
  }

  private drawFeedback(): void {
    if (this.feedbackTimer > 0) {
      const alpha = this.p.map(this.p.min(this.feedbackTimer, 60), 0, 60, 0, 255);
      this.p.fill(200, 255, 200, alpha);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(32);
      this.p.text(this.feedbackMessage, this.p.width / 2, this.p.height / 2);
      this.feedbackTimer--;
    }
  }

  private drawWaitingScreen(): void {
    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(32);
    this.p.text('Press "Start Game" to Play', this.p.width / 2, this.p.height / 2);
  }

  private drawGameOverScreen(): void {
    this.p.background(10, 20, 40, 200);
    this.p.fill(255, 50, 50);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(64);
    this.p.text('GAME OVER', this.p.width / 2, this.p.height / 2 - 40);
    this.p.fill(255);
    this.p.textSize(32);
    this.p.text(`Final Score: ${this.score}`, this.p.width / 2, this.p.height / 2 + 20);
  }
}
