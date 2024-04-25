const axios = require('axios');
const request = require('supertest');

const testGroupMembershipChange = async (app, endpoint, requestData, expectedGroupName) => {
    axios.post.mockResolvedValueOnce({ data: { uuid: 'group-uuid' } });
    axios.put.mockResolvedValueOnce({ data: { previousGroup: 'previous-group-uuid' } });
    axios.get.mockResolvedValueOnce({ data: { groupName: expectedGroupName } });
    axios.post.mockResolvedValueOnce({});

    const response = await request(app)
      .post(endpoint)
      .send(requestData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ uuid: 'group-uuid' });

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

module.exports = testGroupMembershipChange;