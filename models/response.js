function apiResponse(status, result, error) {
    this.status = status,
    this.result = result;
    this.error = error;
    this.requestedDate = new Date();
}

module.exports = apiResponse;