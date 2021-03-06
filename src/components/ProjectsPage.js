import React, { Component } from "react";
import axios from "axios";
import http from "../http-common";
import Modal from "./Modal";
import Navigation from "./Router";
import { Button } from "reactstrap";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import {
  backgroundColor,
  highlightColor,
  primaryColor,
  secondaryColor,
} from "./Style";

import { trackPromise } from "react-promise-tracker";

/* COMPONENT THAT RENDERS PROJECTS PAGE */

export default class PersonalProjects extends Component {
  constructor(props) {
    super(props);
    // set this.state fields
    this.state = {
      viewCategory: "applications", // set to applications by default
      todoList: [],
      modal: false, // set to false by default (handles project pop-up)
      activeItem: {
        title: "",
        description: "",
        category: "",
        app_link: "",
        source_code: "",
        image_link: "",
      },
    };
  }

  // calls the refreshList function every time this component is mounted
  componentDidMount() {
    this.refreshList();
  }

  // helper function that refreshes/populates to-do list
  async refreshList() {
    trackPromise(
      http
        .get("/api/projects/")
        .then((res) => this.setState({ todoList: res.data }))
        .then(console.log)
        .catch((err) => console.log(err))
    );
  }

  // helper function that sets modal to true if currently false, and vice versa
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  // helper function that triggers modal pop-up for the project item passed in
  displayDetails = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // helper function that sets this.state.viewCategory equal to the string parameter passed in
  displayCategory = (category) => {
    return this.setState({ viewCategory: category });
  };

  // helper function to render tab toggle
  renderTabList = () => {
    return (
      <div
        style={{
          backgroundColor: backgroundColor,
          borderColor: primaryColor,
        }}
        className="nav nav-tabs"
      >
        <span
          style={
            this.state.viewCategory === "applications"
              ? {
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                }
              : {
                  backgroundColor: backgroundColor,
                  borderColor: primaryColor,
                }
          }
          className={
            this.state.viewCategory === "applications"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => this.displayCategory("applications")}
        >
          <text
            style={
              this.state.viewCategory === "applications"
                ? { fontSize: "medium", color: highlightColor }
                : { fontSize: "medium", color: primaryColor }
            }
          >
            Applications
          </text>
        </span>
        <span
          style={
            this.state.viewCategory === "mini-projects"
              ? {
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                }
              : {
                  backgroundColor: backgroundColor,
                  borderColor: primaryColor,
                }
          }
          className={
            this.state.viewCategory === "mini-projects"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => this.displayCategory("mini-projects")}
        >
          <text
            style={
              this.state.viewCategory === "mini-projects"
                ? { fontSize: "medium", color: highlightColor }
                : { fontSize: "medium", color: primaryColor }
            }
          >
            Mini-Projects
          </text>
        </span>
      </div>
    );
  };

  // helper function to render main body of projects display
  renderItems = () => {
    const { viewCategory } = this.state;
    // for item : todoList, if item.category equals this.state.viewCategory, add to newItems
    const newItems = this.state.todoList.filter(
      (item) => item.category === viewCategory
    );

    // for item : newItems...
    return newItems.map((item) => (
      <li
        style={{ backgroundColor: primaryColor }}
        key={item.id}
        className="list-group-item d-flex flex-wrap justify-content-between align-items-center"
      >
        <MDBContainer>
          <MDBRow>
            {/* displays item title */}
            <MDBCol md="7">
              <div className="p-2 pt-5" style={{ color: highlightColor }}>
                <h5>
                  <b>{item.title}</b>
                </h5>
              </div>
              <div className="p-2 my-1">
                <Button
                  color="success"
                  onClick={() => this.displayDetails(item)}
                >
                  What's this?
                </Button>
              </div>
            </MDBCol>
            {/* displays item image */}
            <MDBCol md="5" className="my-3">
              <img
                src={item.picture_link}
                width="100%"
                height="100%"
                alt={item.title + " preview"}
                style={{ boxShadow: "7px 7px" + secondaryColor }}
              ></img>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </li>
    ));
  };

  // main rendering function that renders everything
  render() {
    return (
      <div>
        <Navigation />
        <main className="container pb-4">
          <h1 className="text-center my-5" style={{ color: primaryColor }}>
            projects.
          </h1>
          <div className="row">
            <div className="col">
              <div
                className="card p-3 mb-4"
                style={{
                  backgroundColor: backgroundColor,
                  borderColor: backgroundColor,
                }}
              >
                {this.renderTabList()}
                <ul className="list-group list-group-flush border-top-0">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
          {/* if this.state.modal == true, display task-edit pop-up */}
          {this.state.modal ? (
            <Modal activeItem={this.state.activeItem} onSave={this.toggle} />
          ) : null}
        </main>
      </div>
    );
  }
}
