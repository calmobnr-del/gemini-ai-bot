import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
import p5 from 'p5';
import { Game } from './asteroid/game.class';
import { GameWord } from './asteroid/model';

@Component({
  selector: 'app-bot-games-page',
  standalone: true,
  imports: [],
  templateUrl: './games-page.html',
  styleUrl: './games-page.css',
})
export class GamesPage implements AfterViewInit, OnDestroy {
  @ViewChild('sketchHost', { static: true }) sketchHost!: ElementRef;

  // Extend the p5 type to let TypeScript know about our custom method
  private p5Instance!: p5 & { resetGame?: () => void };

  // This signal controls the UI buttons in the Angular template
  public gameStatus = signal<'waiting' | 'playing' | 'stopped' | 'gameOver'>('waiting');

  ngAfterViewInit(): void {
    // Create the p5 instance, passing the onGameOver callback to the sketch
    this.p5Instance = new p5(this.sketch(this.onGameOver));
    // The sketch starts in a paused state until the user clicks "Start"
    this.p5Instance.noLoop();
  }

  ngOnDestroy(): void {
    // Clean up the p5 instance when the component is removed
    this.p5Instance.remove();
  }

  // --- Methods Called by Angular Buttons ---

  startGame(): void {
    // Tell the sketch's internal game logic to reset
    if (this.p5Instance.resetGame) {
      this.p5Instance.resetGame();
    }
    // Start the p5.js draw() loop
    this.p5Instance.loop();
    this.gameStatus.set('playing');
  }

  stopGame(): void {
    // Pause the p5.js draw() loop
    this.p5Instance.noLoop();
    this.gameStatus.set('stopped');
  }

  // Callback for the sketch to notify Angular when the game has ended
  private onGameOver = () => {
    this.gameStatus.set('gameOver');
  };

  // --- The p5.js Sketch ---
  // This function now acts as a "bridge" between Angular and our Game class.
  private sketch = (onGameOver: () => void) => (p: p5) => {
    let game: Game;
    let inputField: p5.Element;

    p.setup = () => {
      const container = this.sketchHost.nativeElement;
      p.createCanvas(container.clientWidth, container.clientHeight).parent(container);

      const wordList: GameWord[] = [
        { ua: 'можливість', en: 'opportunity' },
        { ua: 'усвідомлення', en: 'awareness' },
        { ua: 'наслідок', en: 'consequence' },
        { ua: 'різноманітність', en: 'diversity' },
        { ua: 'зобов\'язання', en: 'commitment' },
        { ua: 'досягати', en: 'to achieve' },
        { ua: 'впливати', en: 'to influence' },
        { ua: 'з\'ясувати', en: 'to figure out' },
        { ua: 'брати участь', en: 'to participate' },
        { ua: 'розглядати (варіант)', en: 'to consider' },
        { ua: 'ефективний', en: 'efficient' },
        { ua: 'значний', en: 'significant' },
        { ua: 'складний (вишуканий)', en: 'sophisticated' },
        { ua: 'надійний', en: 'reliable' },
        { ua: 'вичерпний', en: 'comprehensive' },
        { ua: 'впоратися з', en: 'to cope with' },
        { ua: 'незважаючи на', en: 'despite' },
        { ua: 'брати до уваги', en: 'to take into account' },
        { ua: 'бути вартим (чогось)', en: 'to be worth (something)' },
        { ua: 'врешті-решт', en: 'eventually' }
      ];

      inputField = p.createInput('');
      positionInput();

      // Create an instance of our main Game class
      game = new Game(p, wordList, inputField, onGameOver);

      // Wire up events
      (inputField.elt as HTMLInputElement).addEventListener('change', () => game.checkAnswer());
      (p as any).resetGame = () => game.reset();
    };

    p.draw = () => {
      p.background(10, 20, 40);
      drawStars();

      // Delegate all updating and drawing to the Game class
      if (game) {
        game.update();
        game.draw();
      }
    };

    const positionInput = () => {
      const container = this.sketchHost.nativeElement;
      inputField.size(350, 40);
      inputField.position(
        (container.offsetLeft + container.offsetWidth / 2) - (inputField.width as number) / 2,
        (container.offsetTop + container.offsetHeight) - 70
      );
      inputField.style('font-size', '20px');
      inputField.style('text-align', 'center');
      inputField.style('border-radius', '8px');
      inputField.style('border', '2px solid #fff');
      inputField.style('background-color', '#101020');
      inputField.style('color', '#fff');
    };

    const drawStars = () => {
      p.stroke(255, 255, 255, 150);
      p.strokeWeight(2);
      for(let i = 0; i < 100; i++) {
        let x = (p.noise(i * 10.1, p.frameCount * -0.001) * p.width * 1.2) - p.width * 0.1;
        let y = (p.noise(i * 20.2, p.frameCount * -0.001) * p.height * 1.2) - p.height * 0.1;
        p.point(x, y);
      }
      p.noStroke();
    };

    p.windowResized = () => {
      const container = this.sketchHost.nativeElement;
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      positionInput();
    };
  };
}
