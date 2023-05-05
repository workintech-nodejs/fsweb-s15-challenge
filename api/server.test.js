const request  = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

beforeAll(async()=>{
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
});

// testleri buraya yazın
test('[0] Testler çalışır durumda]', () => {
  expect(true).toBe(true)
})

describe("Auth Test",()=>{
  it("[1] Register Başarılı mı?",async()=>{
    //arrange
    const sampleModel = { "username":"veysel","password":"1234" };
    //act
    const result = await request(server).post("/api/auth/register").send(sampleModel);
    //assert
    expect(result.status).toBe(201);
    expect(result.body.id).toBeGreaterThan(0);
  });
  it("[2] username boş olunca hata veriyor mu?", async()=>{
    //arrange
    const sampleModel = { "password":"1234" };
    //act
    const result = await request(server).post("/api/auth/register").send(sampleModel);
    //assert
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("username ve password gereklidir");
  });
  it("[3] username kontrolü yapılıyor mu?", async()=>{
    //arrange
    const sampleModel = { "username":"user1","password":"1234" };
    //act
    const result =  await request(server).post("/api/auth/register").send(sampleModel);
    //assert
    expect(result.status).toBe(401);
  });
  it("[4] login sonucunda token üretiliyor mu?",async()=>{
     //arrange
     const sampleModel = { "username":"veysel","password":"1234" };
     //act
     const result = await request(server).post("/api/auth/login").send(sampleModel);
     //assert
     expect(result.status).toBe(200);
     expect(result.body.token.length).toBeGreaterThan(3);
  });
  it("[5] tokensız bilmeceler açılıyor mu",async()=>{
     //act
     const result = await request(server).get("/api/bilmeceler");
     expect(result.status).toBe(400);
     expect(result.body.message).toBe("token gereklidir");
  })
  it("[6] bilmeceler token ile açılıyor mu",async()=>{
     //arrange
     const sampleModel = { "username":"veysel","password":"1234" };
     //act
     const loginResult = await request(server).post("/api/auth/login").send(sampleModel);
     const result = await request(server).get("/api/bilmeceler").set("authorization",loginResult.body.token);
     //assert
     expect(result.status).toBe(200);
     expect(result.body.length).toBe(3);
     
  })
});