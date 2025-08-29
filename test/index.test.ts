import axios from "axios";

function add(a: number, b: number): number {
  return a + b;
}

const URL = "http://localhost:3000"

describe("Authentication", () => {
  test("User is Able to Signup", async () => {
    let username = "Parth" + Math.random();
    let password = "helloworld";
    const res: any = await axios.post("http://localhost:3000/api/v1/user/signin", {
      username,
      password,
      type: "admin",
    });

    expect(res.status).toBe(201);
    expect(res.data.token).toBeDefined()

    try {
        await axios.post("http://localhost:3000/api/v1/user/signin", {
          username,
          password,
          type: "admin",
        });
      } catch (error: any) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.success).toBe(false);
      }
  });

  test("User singup request fails if the username is empty", async () => {
    let password = "1234";

    try {
        const res = await axios.post("http://localhost:3000/api/v1/user/signin", {
        password,
        });
    } catch (error: any) {
        expect(error.response.status).toBe(400);
    }

  });
});

describe("User Information Endpoints", () => {
    let token = ""
    let avatarId = ""
    beforeAll(async () => {
        const username = "parth" + Math.random();
        let password = "1234"

        const res = await axios.post("http://localhost:3000/api/v1/user/signin", {
            username,
            password,
        })

        token = res.data.token

        const avatarResponse = await axios.post(URL + "/api/v1/admin/avatar", {
            imageUrl: "https://www.google.com/imgres?q=meme%20avatars&imgurl=https%3A%2F%2Ffiverr-res.cloudinary.com%2Fimages%2Ft_main1%2Cq_auto%2Cf_auto%2Cq_auto%2Cf_auto%2Fgigs%2F38577360%2Foriginal%2Ffe4a778310a86b3072d4f2d2c0b1ee38a4e2a3e7%2Fdo-a-spoderman-meme-avatar-of-you.png&imgrefurl=https%3A%2F%2Fwww.fiverr.com%2Fyapzor%2Fdo-a-spoderman-meme-avatar-of-you&docid=D2q4auqYLkZy3M&tbnid=F0b7Wz9yWIGK7M&vet=12ahUKEwib3fGQrLCPAxWje2wGHQ3yOgAQM3oECBYQAA..i&w=680&h=712&hcb=2&ved=2ahUKEwib3fGQrLCPAxWje2wGHQ3yOgAQM3oECBYQAA",
            name: "SpiderMan",
            headers: {
                Authorization: `Bearer ${token}`
              }            
        })

        avatarId = avatarResponse.data.avatarId
    })

    test("User can't update their avatar with wrong Avatar Id", async () => {
        try {
            await axios.post(URL + "/api/v1/user/metadata", {
                avatarId: "123121324234"
            })
        } catch (error: any) {
            expect(error.response.status).toBe(404)
        }
    })

    test("User can update their avatar Id", async () => {
        const response = await axios.post(URL + "/api/v1/user/metadata", {
            avatarId: "123121324234"
        })

        expect(response.status).toBe(200)
    })
})
