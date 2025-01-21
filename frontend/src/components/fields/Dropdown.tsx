import React, { useState, useRef, useMemo, useEffect } from "react";

interface DropdownProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  hasError: boolean;
  isErrorSuppressed?: boolean;
  errorMessage?: string;
  otherText?: string; // Label for "Other" option
  otherSpecifyText?: string; // Label for specifying "Other" alternative input
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  value,
  onChange,
  options,
  hasError,
  isErrorSuppressed,
  errorMessage,
  otherText,
  otherSpecifyText
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [filter, setFilter] = useState("");
  const [otherInput, setOtherInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Combine "Other" at the top with options
  const optionEntries: [string, string][] = useMemo(() => {
    const entries = Object.entries(options) as [string, string][];
    return otherText ? [["Other", otherText], ...entries] : entries;
  }, [options, otherText]);

  const filteredOptions = useMemo(
    () =>
      optionEntries.filter(([_, label]) =>
        label.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, optionEntries]
  );

  useEffect(() => {
    if (value.startsWith("Other:")) {
      setOtherInput(value.split(": ")[1] || "");
    } else {
      setOtherInput("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleOptionClick = ([key]: [string, string]) => {
    if (key === "Other") {
      onChange("Other: ");
    } else {
      onChange(key);
    }
    setFilter("");
    setIsOpen(false);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setOtherInput(input);
    onChange(`Other: ${input}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
      scrollToOption((highlightedIndex + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? filteredOptions.length - 1 : prev - 1
      );
      scrollToOption(
        highlightedIndex === 0 ? filteredOptions.length - 1 : highlightedIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleOptionClick(filteredOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const scrollToOption = (index: number) => {
    const list = listRef.current;
    const option = list?.children[index] as HTMLElement;
    option?.scrollIntoView({ block: "nearest" });
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      setIsOpen(false);
      setFilter("");
    }
  };

  const handleClear = () => {
    onChange("");
    setFilter("");
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="usa-combo-box max-w-full font-base"
      onBlur={handleBlur}
      data-testid="combo-box"
    >
      {hasError && !isErrorSuppressed && (
        <p className="mt-1 !text-error_red">{errorMessage}</p>
      )}
      <div className="usa-combo-box__input-wrapper font-sans" style={{ position: "relative" }}>
        <input
          type="text"
          id={id}
          className="usa-combo-box__input font-sans font-base"
          role="combobox"
          aria-owns={`${id}--list`}
          aria-controls={`${id}--list`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex !== null
              ? `${id}--list--option-${highlightedIndex}`
              : undefined
          }
          autoComplete="off"
          value={filter || (value.startsWith("Other:") ? otherText : options[value]) || ""}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          data-testid="combo-box-input"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear the select contents"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "4.5rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgb(9, 31, 47)",
              fontSize: "1.3rem",
            }}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className="usa-combo-box__toggle-list mr-2"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle the dropdown list"
        >
          <span className="usa-combo-box__input-button-separator"/>
        </button>
      </div>
      <ul
        id={`${id}--list`}
        ref={listRef}
        className="usa-combo-box__list font-sans font-base"
        role="listbox"
        hidden={!isOpen}
      >
        {filteredOptions.map(([key, label], index) => (
          <li
            key={key}
            id={`${id}--list--option-${index}`}
            className={`usa-combo-box__list-option !font-normal !font-sans font-base ${
              highlightedIndex === index ? "usa-combo-box__list-option--focused" : ""
            } ${value === key ? "usa-combo-box__list-option--selected" : ""}`}
            role="option"
            aria-selected={highlightedIndex === index}
            tabIndex={-1}
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseDown={() => handleOptionClick([key, label])}
          >
            {label}
          </li>
        ))}
      </ul>
      {value.startsWith("Other:") && (
        <div className="mt-6 w-full">
          <label htmlFor={`${id}-other-input`} className="font-sans font-bold">
            {otherSpecifyText}
          </label>
          <input
            id={`${id}-other-input`}
            type="text"
            value={otherInput}
            onChange={handleOtherInputChange}
            className="usa-input w-full max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Dropdown;