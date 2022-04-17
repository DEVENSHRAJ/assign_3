import React, { Component } from "react";


export default class compiler extends Component {
  constructor(props) {
    super(props);
    this.inputcoderef = React.createRef();
    this.outputcoderef = React.createRef();
    this.userinputref=React.createRef();
    this.sendmailref = React.createRef();
    this.state = {
      input: localStorage.getItem('input')||``,
      output: ``,
      language_id:localStorage.getItem('language_Id')|| 2,
      user_input: ``,
      isSubmitted: false,
      email: ''
    }


  }
  handleEmailChange(event){
    const inputValue=event.target.value;
    this.setState({email:inputValue});
  }
  sendEmail() {
          console.log("working fine"+"\n"+"gyhjbhj");

  fetch("https://easymail.p.rapidapi.com/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "easymail.p.rapidapi.com",
        "x-rapidapi-key": "2d264de633msh3e6b69624ce8f3fp10203cjsnbd7f58d68273",
        accept: "application/json",
      },
      body:JSON.stringify ({
        "from": {
          "name": "My Code from Avtaar"
        },
        "to": {
          "name": "Myself",
          "address": this.sendmailref.current.value
        },
        "subject": "Your recently wrote code",
        "message": "<b>your code:<b>"+this.inputcoderef.current.value+"<br/><b>your input  <b>"+this.userinputref.current.value+" <br/><b>your output  <b>"+this.outputcoderef.current.value,
        "show_noreply_warning": true
      })
    })
    .then(response => {
      console.log("Message is send to "+this.sendmailref.current.value);
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });


  }

  input = (event) => {
    event.preventDefault();
    this.setState({ input: event.target.value });
    localStorage.setItem('input', event.target.value)
  };

  userInput = (event) => {
    event.preventDefault();
    this.setState({ user_input: event.target.value });
  };

  language = (event) => {
    event.preventDefault();
    this.setState({ language_id: event.target.value });
    localStorage.setItem('language_Id',event.target.value)

  };



  submit = async (e) => {
    e.preventDefault();
    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "2d264de633msh3e6b69624ce8f3fp10203cjsnbd7f58d68273", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: this.state.input,
          stdin: this.state.user_input,
          language_id: this.state.language_id,
        }),
      }
    ).then(res => {
        console.log(res);
        return res;
})
.catch(err => {
        console.error(err);
});

    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "2d264de633msh3e6b69624ce8f3fp10203cjsnbd7f58d68273", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }

    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      outputText.innerHTML = "";
      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  };

  render() {
    let message;

    return (
      <>
        <div className="row">



            <label htmlFor="tags" className="mr-1">
              <b className="heading">Language:</b>
            </label>
            <select
              value={this.state.language_id}
              onChange={this.language}
              id="tags"
              className="form-control form-inline mb-2 language"
            >
              <option value="54">C++</option>
              <option value="50">C</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
            </select>

        </div>



          <div>
                      <div><br/>
                                        <label htmlFor="solution ">
                                                <span className="badge badge-info heading mt-2 ">
                                                  <i className="fas fa-code fa-fw fa-lg"></i> Code Here
                                                </span>
                                              </label>

                                              <br/>
                                              <textarea
                                                required
                                                name="solution"
                                                id="source"
                                                onChange={this.input}
                                                className="source"
                                                value={this.state.input}
                                                ref= {this.inputcoderef}
                                              ></textarea>
                                              <br/>


                                              <div className="mt-2 ml-5">
                                              <label>
                                                <span className="badge badge-primary heading my-2 ">
                                                  <i className="fas fa-user fa-fw fa-md"></i> User Input
                                                </span>
                                                </label>
                                                <br/>
                                                <textarea className="input" id="input" onChange={this.userInput} ref={this.userinputref}></textarea>
                                              </div>

                                              <button
                                                type="submit"
                                                className="btn btn-danger ml-2 mr-2 "
                                                onClick={this.submit}
                                              >
                                                <i className="fas fa-cog fa-fw"></i> Run
                                              </button>
                                              <br/>
                                              <form method="post">
                                          <label for="email">Send your code and its output in...<br/><b>Enter your email:</b></label>
                                          <input
                                      value={this.state.email}
                                      onChange={(event) => {this.handleEmailChange(event)}}
                                      type="email" id="email" name="email" ref= {this.sendmailref}/>

                                        <input type="button" value="Send Mail" onClick={()=>{this.sendEmail()}} />
                                        </form>

                      </div>
                      <div>
                                        <div className="output">
                                              <span className="badge badge-info heading my-2 ">
                                                <i className="fas fa-exclamation fa-fw fa-md"></i> Output
                                              </span>
                                              <br/>
                                              <textarea  className="outputtext" id="output" ref={this.outputcoderef}></textarea>
                                          </div>
                    </div>

        </div>

      </>
    );
  }
}
