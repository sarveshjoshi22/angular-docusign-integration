import { Component, OnInit } from "@angular/core";
import { Resume, Experience, Education, Skill } from "./resume";
import { ScriptService } from "./script.service";
import { ApiService } from "./api.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { environment } from "../environments/environment";
declare let pdfMake: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  name = "E-signature";
  editSign = true;
  resume = new Resume();

  degrees = ["B.E.", "M.E.", "B.Com", "M.Com"];
  queryParams: Params;
  constructor(
    private scriptService: ScriptService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.resume = JSON.parse(sessionStorage.getItem("resume")) || new Resume();
    if (!this.resume.experiences || this.resume.experiences.length === 0) {
      this.resume.experiences = [];
      this.resume.experiences.push(new Experience());
    }
    if (!this.resume.educations || this.resume.educations.length === 0) {
      this.resume.educations = [];
      this.resume.educations.push(new Education());
    }
    if (!this.resume.skills || this.resume.skills.length === 0) {
      this.resume.skills = [];
      this.resume.skills.push(new Skill());
    }
    this.scriptService.load("pdfMake", "vfsFonts");
  }

  ngOnInit() {
    this.resume = new Resume();
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.substr(1));

    if (searchParams.get("access_token")) {
      sessionStorage.setItem("access_token", searchParams.get("access_token"));
    }

    if (
      sessionStorage.getItem("access_token") ||
      searchParams.get("access_token")
    ) {
      console.log(sessionStorage.getItem("access_token"));
      this.router.navigate([""]);
    } else {
      console.log("get access token");
      const getAuth = `${environment.authUrl}?response_type=token&scope=signature&client_id=
      ${environment.clientId}&redirect_uri=${environment.redirectUrl}`;
      window.location.href = getAuth;
    }
  }

  addExperience() {
    this.resume.experiences.push(new Experience());
  }

  addEducation() {
    this.resume.educations.push(new Education());
  }

  getPayload() {
    const payLoad = {
      recipients: {
        signers: [
          {
            email: this.resume.email,
            name: this.resume.name,
            recipientId: 1,
            tabs: {
              signHereTabs: [
                {
                  xPosition: "100",
                  yPosition: "100",
                  documentId: "1",
                  pageNumber: "1",
                },
                {
                  anchorString: "Please Sign Here",
                  anchorXOffset: "1",
                  anchorYOffset: "0",
                  anchorIgnoreIfNotPresent: "false",
                  anchorUnits: "inches",
                },
                {
                  anchorString: "S12",
                  anchorXOffset: "1",
                  anchorYOffset: "0",
                  anchorIgnoreIfNotPresent: "false",
                  anchorUnits: "inches",
                },
              ],
              checkboxTabs: [
                {
                  selected: "true",
                  tabLabel: "ckAuthorization",
                },
                {
                  selected: "true",
                  tabLabel: "ckAgreement",
                },
              ],
              textTabs: [
                {
                  tabLabel: "EditableDataField",
                  locked: "false",
                  xPosition: "400",
                  yPosition: "400",
                  documentId: "1",
                  pageNumber: "1",
                },
                {
                  tabLabel: "ReadOnlyDataField",
                  value: "$100",
                  locked: "true",
                  xPosition: "300",
                  yPosition: "200",
                  documentId: "1",
                  pageNumber: "1",
                },
              ],
            },
          },
        ],
        carboncopies: [
          {
            email: this.resume.emailCC,
            name: "TestCC",
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

  generatePdf(action = "open") {
    console.log(pdfMake);

    const documentDefinition = this.getDocumentDefinition();
    console.log(documentDefinition);

    const requestPayload = this.getPayload();
    if (!this.resume.profilePic) {
      alert('Please select file');
      return;
    }

    this.api.postDocument(requestPayload).subscribe((data) => {
      console.log(data);
      alert('Email send successfully');
    });

    return;
    switch (action) {
      case "open":
        pdfMake.createPdf(documentDefinition).open();
        break;
      case "print":
        pdfMake.createPdf(documentDefinition).print();
        break;
      case "download":
        pdfMake.createPdf(documentDefinition).download();
        break;

      // default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  resetForm() {
    this.resume = new Resume();
  }

  getDocumentDefinition() {
    sessionStorage.setItem("resume", JSON.stringify(this.resume));
    return {
      content: [
        {
          text: "RESUME",
          bold: true,
          fontSize: 20,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              {
                text: this.resume.name,
                style: "name",
              },
              {
                text: this.resume.address,
              },
              {
                text: "Email : " + this.resume.email,
              },
              {
                text: "Contant No : " + this.resume.contactNo,
              },
              {
                text: "GitHub: " + this.resume.socialProfile,
                link: this.resume.socialProfile,
                color: "blue",
              },
            ],
            [this.getProfilePicObject()],
          ],
        },
        {
          text: "Skills",
          style: "header",
        },
        {
          columns: [
            {
              ul: [
                ...this.resume.skills
                  .filter((value, index) => index % 3 === 0)
                  .map((s) => s.value),
              ],
            },
            {
              ul: [
                ...this.resume.skills
                  .filter((value, index) => index % 3 === 1)
                  .map((s) => s.value),
              ],
            },
            {
              ul: [
                ...this.resume.skills
                  .filter((value, index) => index % 3 === 2)
                  .map((s) => s.value),
              ],
            },
          ],
        },
        {
          text: "Experience",
          style: "header",
        },
        this.getExperienceObject(this.resume.experiences),

        {
          text: "Education",
          style: "header",
        },
        this.getEducationObject(this.resume.educations),
        {
          text: "Other Details",
          style: "header",
        },
        {
          text: this.resume.otherDetails,
        },
        {
          text: "Signature",
          style: "sign",
        },
        {
          columns: [
            {
              qr: this.resume.name + ", Contact No : " + this.resume.contactNo,
              fit: 100,
            },
            this.getSignaturePicObject(),
          ],
        },
      ],
      info: {
        title: this.resume.name + "_RESUME",
        author: this.resume.name,
        subject: "RESUME",
        keywords: "RESUME, ONLINE RESUME",
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: "underline",
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: "right",
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }

  getExperienceObject(experiences: Experience[]) {
    const exs = [];

    experiences.forEach((experience) => {
      exs.push([
        {
          columns: [
            [
              {
                text: experience.jobTitle,
                style: "jobTitle",
              },
              {
                text: experience.employer,
              },
              {
                text: experience.jobDescription,
              },
            ],
            {
              text: "Experience : " + experience.experience + " Months",
              alignment: "right",
            },
          ],
        },
      ]);
    });

    return {
      table: {
        widths: ["*"],
        body: [...exs],
      },
    };
  }

  getEducationObject(educations: Education[]) {
    return {
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          [
            {
              text: "Degree",
              style: "tableHeader",
            },
            {
              text: "College",
              style: "tableHeader",
            },
            {
              text: "Passing Year",
              style: "tableHeader",
            },
            {
              text: "Result",
              style: "tableHeader",
            },
          ],
          ...educations.map((ed) => {
            return [ed.degree, ed.college, ed.passingYear, ed.percentage];
          }),
        ],
      },
    };
  }

  getProfilePicObject() {
    if (this.resume.profilePic) {
      console.log(this.resume.profilePic);
      return {
        image: this.resume.profilePic,
        width: 75,
        alignment: "right",
      };
    }
    return null;
  }

  getSignaturePicObject() {
    if (this.resume.signature) {
      console.log(this.resume.signature);
      return {
        image: this.resume.signature,
        width: 75,
        alignment: "right",
      };
    }
    return null;
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

  addSkill() {
    this.resume.skills.push(new Skill());
  }

  showMessageFromChild(image) {
    this.editSign = false;
    this.resume.signature = image;
  }

  updateSign() {
    this.editSign = true;
  }
}
