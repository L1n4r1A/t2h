import { Component, JSX, createSignal, onMount } from "solid-js";
import { convertTextToHTML } from "./scripts/convertToHTML";
import { addEventListener } from "solid-js/web";

const [outputText, setOutputText] = createSignal("");
const [parseMD, setParseMD] = createSignal(false);

let inputTextElem: HTMLTextAreaElement;
let outputTextElem: HTMLTextAreaElement;
let parseMDtoggleElem: HTMLInputElement;
let copyButtonElem: HTMLButtonElement;

const App: Component = () => {
  onMount(() => {
    inputTextElem.value = localStorage.getItem("input") ?? "";
    parseMDtoggleElem.checked = JSON.parse(localStorage.getItem("parseMD") ?? "false");
    setParseMD(parseMDtoggleElem.checked);

    addEventListener(inputTextElem, "scroll", scrollInput, false);
    addEventListener(inputTextElem, "onkeydown", scrollInput, false);
    addEventListener(outputTextElem, "scroll", scrollOutput, false);
    addEventListener(outputTextElem, "onkeydown", scrollOutput, false);

    convertInputText();
  });

  return (
    <div class="flex h-screen flex-col justify-stretch bg-bg text-fg">
      <header class="m-4 flex items-center justify-between">
        <h1 class="text-4xl font-black">なんかいい感じ™のツール名</h1>
        <div class="mx-4 flex justify-between">
          <label class="flex cursor-pointer select-none items-center">
            <div class="relative mx-2">
              <input
                type="checkbox"
                class="sr-only"
                onInput={toggleParseMD}
                ref={parseMDtoggleElem}
              />
              <div class="toggle-bg block h-8 w-14 rounded-full bg-panelHeaderBg"></div>
              <div class="dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition">
                <span class="active hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon-tabler icon-tabler-check icon text-white"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    stroke-width={2}
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                </span>
                <span class="inactive text-fg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon-tabler icon-tabler-x icon text-fg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    stroke-width={2}
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M18 6l-12 12"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </span>
              </div>
            </div>
            <span class="text-xl font-semibold">Parse Markdown</span>
          </label>
        </div>
      </header>
      <main class="mb-8 flex flex-1 flex-col">
        <div class="flex flex-1 items-center">
          <div class="m-8 flex h-full flex-1 flex-col justify-stretch">
            <h2 class="my-2 text-2xl font-bold">Input Text</h2>
            <textarea
              class="h-full w-full resize-y rounded bg-panelHeaderBg p-2 outline-none focus:outline focus:outline-2 focus:outline-accent"
              onInput={onChangeInputText}
              ref={inputTextElem}
            ></textarea>
          </div>
          <div class="m-8 flex h-full flex-1 flex-col justify-stretch">
            <div class="flex items-center justify-between">
              <h2 class="my-2 text-2xl font-bold">Output Text</h2>
              <button
                class="mx-2 h-fit rounded-full px-4 py-2 hover:bg-accent hover:bg-opacity-10"
                onClick={copyToClipboard}
                ref={copyButtonElem}
              >
                コピーする
              </button>
            </div>
            <textarea
              class="h-full w-full resize-y rounded bg-panelHeaderBg p-2 font-mono outline-none focus:outline focus:outline-2 focus:outline-accent"
              ref={outputTextElem}
              value={outputText()}
            ></textarea>
          </div>
        </div>
      </main>
    </div>
  );
};

const convertInputText = () => {
  const inputText = inputTextElem.value;

  localStorage.setItem("input", inputText);

  setOutputText(convertTextToHTML(inputText, parseMD()));
};

const onChangeInputText: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent> | undefined = (
  event
) => {
  const inputText = event.target.value;

  localStorage.setItem("input", inputText);

  setOutputText(convertTextToHTML(inputText, parseMD()));
};

const toggleParseMD: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> | undefined = (
  event
) => {
  const checked = event.target.checked;

  setParseMD(checked);

  localStorage.setItem("parseMD", JSON.stringify(checked));

  convertInputText();
};

const scrollInput = () => {
  const inputScrollPos = inputTextElem.scrollTop;
  const inputScrollRatio = inputScrollPos / inputTextElem.scrollHeight;
  const outputTextareaHeight = outputTextElem.scrollHeight;

  outputTextElem.scrollTo(0, Math.round(inputScrollRatio * outputTextareaHeight));
};

const scrollOutput = () => {
  const outputScrollPos = outputTextElem.scrollTop;
  const outputScrollRatio = outputScrollPos / outputTextElem.scrollHeight;
  const inputTextareaHeight = inputTextElem.scrollHeight;

  inputTextElem.scrollTo(0, Math.round(outputScrollRatio * inputTextareaHeight));
};

const copyToClipboard = () => {
  const prevText = copyButtonElem.textContent;
  copyButtonElem.textContent = "コピーしました";

  navigator.clipboard.writeText(outputText());

  setInterval(() => (copyButtonElem.textContent = prevText), 3000, copyButtonElem, prevText);
};

export default App;
