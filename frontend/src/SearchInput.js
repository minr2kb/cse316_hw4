import { useEffect, useState, useCallback } from "react";

function SearchInput() {
	const [query, setQuery] = useState("");
	const [tmpQuery, setTmpQuery] = useState(query);

	const handleChange = e => {
		setTmpQuery(e.target.value);
		debouncedSave(e.target.value);
	};

	const debounce = useCallback((func, timeout = 1000) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}, []);

	const debouncedSave = useCallback(
		debounce(nextValue => setQuery(nextValue), 1000),
		[] // will be created only once initially
	);

	return (
		<>
			<div>
				<div className="search-Input">
					<input value={tmpQuery} onChange={handleChange} />
				</div>
			</div>
			<textarea value={query} />
		</>
	);
}

export default SearchInput;
