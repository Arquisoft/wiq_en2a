const axios = require('axios');
const request = require('supertest');

module.exports = testGroupMembershipChange = async (app, endpoint, requestData, expectedGroupName) => {
    // Mock axios responses
    axios.post.mockResolvedValueOnce({ data: { uuid: 'group-uuid' } });
    axios.put.mockResolvedValueOnce({ data: { previousGroup: 'previous-group-uuid' } });
    axios.get.mockResolvedValueOnce({ data: { groupName: expectedGroupName } });
    axios.post.mockResolvedValueOnce({});

    // Make request to the endpoint
    const response = await request(app)
      .post(endpoint)
      .send(requestData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ uuid: 'group-uuid' });

    // Ensure axios calls were made with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(endpoint),
      requestData
    );
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/addGroup/${requestData.uuid}`),
      { groupUUID: 'group-uuid' }
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`/getGroup/previous-group-uuid`)
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/leaveGroup'),
      { expelledUUID: requestData.uuid, adminUUID: requestData.uuid, groupName: expectedGroupName }
    );
};

