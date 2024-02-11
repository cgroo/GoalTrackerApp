async function joinSpace(name, space_req) {
    const client = new Ably.Realtime.Promise({key: "lz9trA.Kq4iew:1Wf1wVY0w-QOKFG-Zs5eGo-YpndbxD6YlqYmJjnLBDU"});
    const spaces = new Spaces(client);
    const space = await spaces.get(space_req);
    await space.enter({
        username: name,
    });
    console.log('User ${name} is joining space: ${space_req}');
}

export { joinSpace };