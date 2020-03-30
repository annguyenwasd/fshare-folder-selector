import React from "react";
import script from "../script.json";

function Code() {
  return (
    <div>
      <h3>Purpose</h3>
      <p>
        I use Fshare tool to download file <br />
        Maximun Fshare allows 50 file per page. <strong>It's bad!!!</strong>
        This tool allow you select all file in a folder
        <br />
        This example bellow has 442+ files from this link:
        https://www.fshare.vn/folder/PH1EP3YBDNXG7DZ
      </p>
      <h3>Usage:</h3>
      <ol>
        <li>
          Book mark this link: &nbsp;
          <a href={script.code}>Download Fshare Json</a>
          &nbsp; to your browser (drag and drop to bookmark board)
        </li>
        <li>
          Go to Fshare folder(eg:{" "}
          <strong>
            <u>
              {`
          https://fshare.vn/<<Fshare folder code >>
          `}
            </u>
          </strong>
          )
        </li>
        <li>Click on bookmared link</li>
        <li>Click OK on alert dialog to start download</li>
        <li>
          Import downloaded json file by click on <b>Choose File</b> button
          bellow
        </li>
        <li>Click to choose listed files</li>
        <li>
          Click <strong>Get Links</strong> for get links
        </li>
        <li>
          Paste to <strong>FShare Tool</strong>
        </li>
      </ol>
      <i>I give you some default 4k links, Enjoy!!!</i>
    </div>
  );
}

export default Code;
