import {
  Component,
  Input,
  ViewChild,
  OnInit,
  HostListener,
  EventEmitter,
  Output,
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
@Component({
  selector: 'state',
  template: ``,
  styles: [``],
})
export class SetstateComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  // Query parameters found in the URL: /example-params/one/two?query1=one&query2=two
  queryParams: Params;
  ngOnInit() {
    console.log('inside set state');
    // Route parameters
    

    // URL query parameters
    
  }
}
