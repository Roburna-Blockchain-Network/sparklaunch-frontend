import React from "react";
import { isValidUrl } from "utils/helpers";
import discordLogo from "assets/images/icons/discord.png";

import {
  BsFacebook,
  BsTwitter,
  BsYoutube,
  BsGlobe,
  BsDiscord,
  BsTelegram,
  BsReddit,
  BsInstagram,
  BsGithub,
} from "react-icons/bs";

const SocialLinks = ({ links }) => {
  const addProtocolPrefix = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };
  return (
    <>
      {isValidUrl(links.web) && (
        <li className="ms-2">
          <a
            rel="nofollow noreferer"
            target="_blank"
            href={addProtocolPrefix(links.web)}
          >
            <BsGlobe id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.twitter) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.twitter}>
            <BsTwitter id="social" className="fs-3" />
          </a>
        </li>
      )}

      {isValidUrl(links.discord) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.discord}>
            <BsDiscord id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.telegram) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.telegram}>
            <BsTelegram id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.facebook) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.facebook}>
            <BsFacebook id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.youtube) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.youtube}>
            <BsYoutube id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.reddit) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.reddit}>
            <BsReddit id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.insta) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.insta}>
            <BsInstagram id="social" className="fs-3" />
          </a>
        </li>
      )}
      {isValidUrl(links.git) && (
        <li className="ms-2">
          <a rel="nofollow noreferer" target="_blank" href={links.git}>
            <BsGithub id="social" className="fs-3" />
          </a>
        </li>
      )}
    </>
  );
};

export default SocialLinks;
