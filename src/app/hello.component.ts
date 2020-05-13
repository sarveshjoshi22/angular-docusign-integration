import { Component, Input, ViewChild, OnInit, HostListener, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h3>{{name}}</h3>
  <br/>
  <canvas #sigPad width="300" height="150" (mousedown)="onMouseDown($event)"
  (mousemove)="onMouseMove($event)"></canvas>
  <br/><br/>
  <button (click)="clear()">clear</button>
  <button (click)="save()">save</button>
  <br/>
  <!-- <img [src]="img">
  <br/>
  <span>{{img}}</span> -->`,
  styles: [`
  canvas {
    border: 1px solid #000;
  }
  span {
    width: 300px;
  }
  `]
})
export class HelloComponent implements OnInit {
  @Input() name: string;
  @Output() childMessage = new EventEmitter();
  @ViewChild('sigPad', {static: true}) sigPad;
  sigPadElement;
  context;
  isDrawing = false;
  img;

  ngOnInit() {
    // this.name = "testing";
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#3742fa';
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  onMouseDown(e) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  private relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }

  clear() {
   this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  save() {
    this.img = this.sigPadElement.toDataURL("image/png");
    this.childMessage.emit(this.img);
    console.log(this.img);
  }

}
