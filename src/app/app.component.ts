import { Component, OnInit } from "@angular/core";
import { Resume } from "./resume";
import { ApiService } from "./api.service";
import { Params, Router } from "@angular/router";
import { environment } from "../environments/environment";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  resume = new Resume();
  queryParams: Params;
  accessTokenStatus = false;
  constructor(private api: ApiService, private router: Router) {
    this.resume = JSON.parse(sessionStorage.getItem("resume")) || new Resume();
  }

  ngOnInit() {
    this.resume = new Resume();
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.substr(1));

    if (searchParams.get("access_token")) {
      sessionStorage.setItem("access_token", searchParams.get("access_token"));
      this.accessTokenStatus = true;
    }

    if (
      sessionStorage.getItem("access_token") ||
      searchParams.get("access_token")
    ) {
      console.log(sessionStorage.getItem("access_token"));
      this.router.navigate([""]);
    }
  }

  getPayload() {
    let signatureTab = [];
    let textTab = [];
    var signatureTabArray = this.resume.signatureKeyword.split(",");
    var textTabArray = this.resume.textFieldKeyword.split(",");

    let tmpSign, tmpText;

    for (let i = 0; i < signatureTabArray.length; i++) {
      tmpSign = {
        anchorString: signatureTabArray[i],
        anchorXOffset: "0",
        anchorYOffset: "0",
        anchorIgnoreIfNotPresent: "false",
        anchorUnits: "inches",
      };
      signatureTab.push(tmpSign);
    }

    for (let i = 0; i < textTabArray.length; i++) {
      tmpText = {
        tabLabel: "EditableDataField",
        locked: "false",
        anchorString: textTabArray[i],
        anchorXOffset: "0",
        anchorYOffset: "0",
        CustomTabWidth: "20",
        FontSize: "Size12",
        anchorIgnoreIfNotPresent: "false",
        anchorUnits: "inches",
      };
      textTab.push(tmpText);
    }

    console.log(signatureTab);
    console.log(textTab);

    const payLoad = {
      recipients: {
        signers: [
          {
            email: this.resume.email,
            name: this.resume.name,
            recipientId: 1,
            tabs: {
              signHereTabs: signatureTab,
              textTabs: textTab,
            },
          },
        ],
        carboncopies: [
          {
            email: this.resume.emailCC,
            name: "Test",
            recipientId: 2,
          },
        ],
      },
      emailSubject: this.resume.emailSubject,
      documents: [
        {
          documentId: "1",
          name: "Approval",
          documentBase64: this.resume.profilePic,
        },
      ],
      status: "sent",
    };
    return payLoad;
  }

  sendEmail() {
    const requestPayload = this.getPayload();
    if (!this.resume.profilePic) {
      alert("Please select file");
      return;
    }
    console.log(requestPayload);
    this.api.postDocument(requestPayload).subscribe(
      (data) => {
        console.log(data);
        this.resume = new Resume();
        alert("Email send successfully");
      },
      (error) => {
        console.log(error);
        alert(`Error in sending email: Error ${error.error.errorCode}`);
      }
    );
  }

  resetForm() {
    this.resume = new Resume();
  }

  fileChanged(e) {
    const file = e.target.files[0];
    this.getBase64(file);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader);
      const base64result = (<string>reader.result).split(",")[1];
      this.resume.profilePic = base64result;
      console.log(this.resume.profilePic);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  updateAccessToken() {
    console.log("get access token");
    const getAuth = `${environment.authUrl}?response_type=token&scope=signature&client_id=
    ${environment.clientId}&redirect_uri=${environment.redirectUrl}`;
    window.location.href = getAuth;
  }
}
