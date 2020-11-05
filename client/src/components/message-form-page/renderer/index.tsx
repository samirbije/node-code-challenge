
import React from 'react';


export class Renderer extends React.PureComponent<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      username: '',
      text: ''
    };

  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p className="bold">Ho ho ho, what you want for christma?</p>
        who are you?
        <input name="username" type="text" placeholder="charlie.brown" value={this.state.username} onChange={this.handleChange} />
        what do you want for christmas?
        <textarea name="text" rows={10} cols={45} maxLength={100} placeholder="Gifts!" value={this.state.text} onChange={this.handleChange}></textarea>
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }

  public handleChange = (event:any): void => {
    let field = event.target.name as keyof State;
    this.setState({
      ...this.state,
      [field]: event.target.value,
    });
  }

  public validateEmptyValue = (item: string, label: string) => {
    let error_msg = [];
    if (item.length < 1) {
      error_msg.push(`${label} is Empty.`);
    }
    return error_msg
  }

  protected validateMaxMessageSize = (item: string, label: string, size: string) => {
    let error_msg = [];
    if (item.length > 100) {
      error_msg.push(`${label} is too long. Supported size is ${size}`)
    }
    return error_msg
  }

  protected makeApiCall = (username: string, text: string) => {
    let uri = "/api/message";
    let data = {
      username,
      text
    }

    let api_call = fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    api_call.then((res) => {
      if (res.ok) {
        this.setState({
          username: '',
          text: ''
        }, () => {
          alert("Successfully received the message and queued");
        })
      } else {
        res.json().then(
          (err) => {
            console.log("errrrr", err)
            alert(err.message);
          }
        ).catch((e) => {
          console.log("Json parse error on response data")
        });
      }
    }).catch((err) => {
      console.log("Api call error !!")
    });
  }

  protected handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    let username = this.state.username;
    let text = this.state.text;

    let error_msg = [] as string[];
    error_msg = [...error_msg, ...this.validateEmptyValue(username, "Username")]
    error_msg = [...error_msg, ...this.validateEmptyValue(text, "Messagebox")]
    error_msg = [...error_msg, ...this.validateMaxMessageSize(text, "Messagebox", "100")]

  
    if (error_msg.length === 0) {

      this.makeApiCall(username, text)
    } else {
      alert(error_msg.join(" \r\n"));
    }
  }

}

interface State {
  username: string;
  text: string;
}
