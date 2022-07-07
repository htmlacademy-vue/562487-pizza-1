import { shallowMount } from "@vue/test-utils";
import UserPicture from "@/common/components/UserPicture";
import userData from "@/static/user.json";
import { generateAvatar } from "@/common/helpers";

describe("UserPicture", () => {
  const smallSize = { width: "32", height: "32" };
  const bigSize = { width: "72", height: "72" };
  const avatars = generateAvatar(userData.avatar);
  const bigSizeWebpSrcset = `${avatars.webp2x} 2x, ${avatars.webp4x} 4x`;
  const smallSizeWebpSrcset = `${avatars.webp} 1x, ${avatars.webp2x} 2x`;
  const bigSizeJpgSrcset = `${avatars.jpg2x} 2x, ${avatars.jpg4x} 4x`;
  const smallSizeJpgSrcset = `${avatars.jpg} 1x, ${avatars.jpg2x} 2x`;

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(UserPicture, options);
  };

  const findPicture = () => wrapper.find("picture");
  const findSource = () => wrapper.find("source");
  const findImg = () => wrapper.find("img");

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders user picture", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    expect(findPicture().exists()).toBe(true);
    expect(findSource().exists()).toBe(true);
    expect(findImg().exists()).toBe(true);
  });

  it("picture source srcset with small size", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    expect(findSource().attributes().srcset).toBe(smallSizeWebpSrcset);
  });

  it("picture source srcset with big size", () => {
    createComponent({
      propsData: {
        ...bigSize,
        user: userData,
      },
    });
    expect(findSource().attributes().srcset).toBe(bigSizeWebpSrcset);
  });

  it("picture img srcset with small size", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    expect(findImg().attributes().srcset).toBe(smallSizeJpgSrcset);
  });

  it("picture img srcset with big size", () => {
    createComponent({
      propsData: {
        ...bigSize,
        user: userData,
      },
    });
    expect(findImg().attributes().srcset).toBe(bigSizeJpgSrcset);
  });

  it("picture img alt is prop user name", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    expect(findImg().attributes().alt).toBe(userData.name);
  });

  it("picture img src is prop user avatar", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    expect(findImg().attributes().src).toBe(userData.avatar);
  });

  it("picture img with small size", () => {
    createComponent({
      propsData: {
        ...smallSize,
        user: userData,
      },
    });
    const image = findImg();
    expect(image.attributes().width).toBe(smallSize.width);
    expect(image.attributes().height).toBe(smallSize.height);
  });

  it("picture img with big size", () => {
    createComponent({
      propsData: {
        ...bigSize,
        user: userData,
      },
    });
    const image = findImg();
    expect(image.attributes().width).toBe(bigSize.width);
    expect(image.attributes().height).toBe(bigSize.height);
  });
});
