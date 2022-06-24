import {
  findById,
  generate,
  generateAvatar,
  createDeliveries,
} from "@/common/helpers";

describe("test helpers functions", () => {
  it("tests findById", () => {
    const testItems = [{ id: 1 }, { id: 2 }];
    expect(findById([], 1)).toBeUndefined();
    expect(findById(testItems, 2)).toEqual({ id: 2 });
    expect(findById(testItems, 3)).toBeUndefined();
  });

  it("tests generate", () => {
    const testItem = { message: "some message" };
    expect(generate(testItem)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        message: "some message",
      })
    );
  });

  it("generateAvatar", () => {
    const testItem = "/public/img/users/user.jpg";
    expect(generateAvatar(testItem)).toEqual({
      webp: "/public/img/users/user.webp",
      webp2x: "/public/img/users/user@2x.webp",
      webp4x: "/public/img/users/user@4x.webp",
      jpg: "/public/img/users/user.jpg",
      jpg2x: "/public/img/users/user@2x.jpg",
      jpg4x: "/public/img/users/user@4x.jpg",
    });
  });

  it("tests createDeliveries", () => {
    const testItems = [
      { id: 1, name: "address1", street: "street1", building: "1" },
      { id: 2, name: "address2", street: "street2", building: "2" },
    ];
    expect(createDeliveries(testItems)).toEqual([
      { id: 1, name: "address1" },
      { id: 2, name: "address2" },
    ]);
  });
});
