const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let deleteId
suite('Functional Tests', function() {
    suite("Routing Tests", function() {
        suite("3 post request Tests", function() {
            test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
                chai
                   .request(server)
                   .post("/api/issues/projects")
                   .set("content-type", "application/json")
                   .send({
                        issue_title: "Issue",
                        issue_text: "Functional Test",
                        created_by: "fCC",
                        assigned_to: "Don",
                        status_text: "Not Done"
                   })
                   .end(function (err, res) {
                    assert.equal(res.status, 200);
                    deleteId = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.assigned_to, "Don");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.status_text, "Not Done");
                    assert.equal(res.body.issue_text, "Functional Test");
                    done();
                   });         
            });

            test("Create an issue with only required fields: POST request to /api/issue/{project}, function (done)", function (done) {
                chai
                   .request(server)
                   .post("/api/issues/projects")
                   .set("content-type", "application/json")
                   .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: ""
                  })
                  .end(function (err, res) {
                    assert.equal(res.status, 200);
                    deleteID = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.issue_text, "Functional Test");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    done();
                   });

            });

            test("Create an issue with missing required fields: POST request to /api/issue/{project", function(done){
                chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                 issue_title: "",
                 issue_text: "",
                 created_by: "fCC",
                 assigned_to: "",
                 status_text: ""
               })
               .end(function (err, res) {
                 assert.equal(res.status, 200);
                 assert.equal(res.body.error, "required field(s) missing");
                 done();
                });
            });
        });

        suite("3 GET request Tests", function() {
            test("View issues on a project: GET request to /api/issues/{project}", function(done) {
                chai
                   .request(server)
                   .get("/api/issues/test-data-abc123")
                   .end(function (err, res) {
                       assert.equal(res.status, 200);
                       assert.equal(res.body.length, 6);
                       done();
                   });
            });

            test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done) {
                chai
                   .request(server)
                   .get("/api/issues/test-data-abc123")
                   .query({
                    _id: "62ae31a81bfb6a50f9ede017",
                   })
                   .end(function (err, res) {

                       assert.equal(res.status, 200);
                        assert.equal(res.body[0], {"issue_title":"Hey","issue_text":"qwerty","created_on":"2022-06-18T20:12:24.224Z","updated_on":"2022-06-18T20:12:24.224Z","created_by":"Ada","assigned_to":"OBI","open":true,"status_text":"Stat","_id":"62ae31a81bfb6a50f9ede017"});
                       done();
                   });
            });

            test("View issues on a project with multiple filter: GET request to /api/issues/{project}", function(done) {
                chai
                   .request(server)
                   .get("/api/issues/test-data-abc123")
                   .query({
                    issue_title:"Hey",
                    "_id":"62ae31a41bfb6a50f9ede015"
                   })
                   .end(function (err, res) {
                       assert.equal(res.status, 200);

                       assert.equal(res.body[0], {"issue_title":"Hey","issue_text":"qwerty","created_on":"2022-06-18T20:12:20.817Z","updated_on":"2022-06-18T20:12:20.817Z","created_by":"Ada","assigned_to":"OBI","open":true,"status_text":"Stat","_id":"62ae31a41bfb6a50f9ede015"});
                       done();
                   });
            });

            suite("5 PUT request Tests", function() {
                test("Update one field on an issue: PUT request to /api/issues/test-data-put", function (done) {
                    chai
                       .request(server)
                       .put("/api/issues/test-data-put")
                       .send({
                        _id:"62ae33a6f1b984637c639cfc",
                        issue_title:"Updated first put",
                       })
                       .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated");
                        assert.equal(res.body._id, "62ae33a6f1b984637c639cfc");
                        done();
                       });
                });

                test("Update multiple fields on an issue: PUT request to /api/issues/test-data-put", function (done) {
                    chai
                       .request(server)
                       .put("/api/issues/test-data-put")
                       .send({
                        _id:"62ae33a6f1b984637c639cfc",
                        issue_title:"Another Updated first put",
                        issue_text:" Updated some first Put tests",
                       })
                       .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated");
                        assert.equal(res.body._id, "62ae33a6f1b984637c639cfc");
                        done();
                       });
                });

                test("Update an issue with missing_id: PUT request to /api/issues/test-data-put", function (done) {
                    chai
                       .request(server)
                       .put("/api/issues/test-data-put")
                       .send({
                        issue_title:"Another Updated second title",
                        issue_text:" Updated some texts",
                       })
                       .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "missing _id");
                        done();
                       });
                });

                test("Update an issue with no fields to update: PUT request to /api/issues/test-data-put", function (done) {
                    chai
                       .request(server)
                       .put("/api/issues/test-data-put")
                       .send({
                        _id:"62ae33a6f1b984637c639cfc",
                       })
                       .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "no update field(s) sent");
                        done();
                       });
                });

                test("Update an issue with an invalid _id: PUT request to /api/issues/test-data-put", function (done) {
                    chai
                       .request(server)
                       .put("/api/issues/test-data-put")
                       .send({
                        _id:"00acdf89a4f4baaffcef6189",
                        issue_title:"Another Updated second title",
                        issue_text:" Updated some texts",
                       })
                       .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "could not update");
                        done();
                       });
                });
            });

            suite("3 DELETE request Tests", function () {
                test("Delete an issue: DELETE request to /api/issues/projects", function (done) {
                    chai
                       .request(server)
                       .delete("/api/issues/projects")
                       .send({
                          _id: deleteId,
                       })
                       .end(function (err, res) {
                          assert.equal(res.status, 200);
                          assert.equal(res.body.result, "successfully deleted");
                          done();
                       });
                });

                test("Delete an issue with an invalid _id: DELETE request to /api/issues/projects", function (done) {
                    chai
                       .request(server)
                       .delete("/api/issues/projects")
                       .send({
                          _id: "",
                       })
                       .end(function (err, res) {
                          assert.equal(res.status, 200);
                          assert.equal(res.body.result, undefined);
                          done();
                       });
                });

                test("Delete an issue with a missing _id: DELETE request to /api/issues/projects", function (done) {
                    chai
                       .request(server)
                       .delete("/api/issues/projects")
                       .send({})
                       .end(function (err, res) {
                          assert.equal(res.status, 200);
                          assert.equal(res.body.result, undefined);
                          done();
                       });
                });
            })
        })
    })
  
});
