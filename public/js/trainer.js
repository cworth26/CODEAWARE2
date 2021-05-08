	window.onload = getGists().then(displayGist);
			const getLanguages = (() => {
				const codingLanguages = [
					'Python',
					'Kotlin',
					'Java',
					'JavaScript',
					'NodeJS',
					'TypeScript',
					'Go',
					'Swift',
					'Dart',
					'Perl',
					'Rust',
					'PowerShell',
					'Scala',
					' Objective-C',
					'C',
					'Ruby',
					'CSS',
					'C++',
					'C#',
					'PHP',
					'HTML',
					'Haskell',
					'Shell',
					'Dockerfile',
					'Gradle',
					'R',
					'Clojure',
				];
				return () => codingLanguages;
			})();

			let clicked = false;
			let temp = [];
			let globalLanguage = '';
			const points = document.querySelector('#points');

			const createLoader = () => {
				const loader = document.createElement('div');
				loader.classList.add('loader');
				return loader;
			};

			const getValidLanguage = language => {
				const codingLanguage = getLanguages()[
					Math.floor(Math.random() * getLanguages().length)
				];

				if (
					!temp.includes(codingLanguage) &&
					codingLanguage !== language
				) {
					temp.push(codingLanguage);
					return codingLanguage;
				} else {
					return getValidLanguage(language);
				}
			};

			async function getGists() {
				const response = await fetch(
					`https://api.github.com/gists/public?per_page=20&page=${Math.floor(
						Math.random() * 10
					)}`
				);

				const json = await response.json();
				const randomPublicGist =
					json[Math.floor(Math.random() * json.length)];
				const languages = getLanguages();

				const validFiles = Object.values(
					randomPublicGist.files
				).filter(f => languages.includes(f.language));

				if (validFiles.length > 0) {
					const file =
						validFiles[
							Math.floor(Math.random() * validFiles.length)
						];

					return {
						id: randomPublicGist.id,
						username: randomPublicGist.owner.login,
						language: file.language,
						file: file.filename,
					};
				} else {
					console.log('Calling GitHub api');
					return getGists();
				}
			}

			function displayGist(gg) {
				const { id, username, language, file } = gg;
				globalLanguage = language;

				const buttons = document.querySelectorAll(
					'#btns-container > button'
				);
				buttons[
					Math.floor(Math.random() * buttons.length)
				].textContent = language;

				buttons.forEach(btn => {
					btn.textContent !== language
						? (btn.textContent = getValidLanguage(language))
						: (btn.textContent = language);
				});

				const url = `https://gist.github.com/${username}/${id}.js?file=${file}`;
				postscribe(
					'#gist-container',
					`<script src="${url}"><\/script>`
				);

				const gistContainer = document.getElementById('gist-container');
				const loader = document.querySelector('.loader');
				loader.remove();
			}

			const buttonsContainer = document.getElementById('btns-container');
			const highlightButtons = document.querySelectorAll(
				'#btns-container > button'
			);
			buttonsContainer.addEventListener('click', e => {
				if (
					e.target.tagName === 'BUTTON' &&
					!clicked &&
					e.target.textContent !== 'Loading...'
				) {
					if (e.target.textContent === globalLanguage) {
						e.target.classList.add('correct');
						points.textContent = +points.textContent + 50;
						points.classList.add('gained');
						continueBtn.classList.add('show');
					} else {
						e.target.classList.add('incorrect');
						retryButton.classList.add('show');
						highlightButtons.forEach(btn =>
							btn.textContent === globalLanguage
								? btn.classList.add('correct')
								: null
						);
						points.classList.add('lost');
						points.textContent = 0;
					}
					clicked = true;
				}
			});

			const continueBtn = document.querySelector('.continue');
			const retryButton = document.querySelector('.retry');

			const gistContainer = document.getElementById('gist-container');
			const getGitstsAfterScoreUpdated = button => {
				points.classList.remove('lost');
				points.classList.remove('gained');

				temp = [];
				const gistContent = document.querySelector('.gist');
				if (gistContent) {
					gistContent.remove();
				}
				const buttons = document.querySelectorAll(
					'#btns-container > button'
				);
				buttons.forEach(btn => {
					if (btn.classList.contains('incorrect')) {
						btn.classList.remove('incorrect');
					} else if (btn.classList.contains('correct')) {
						btn.classList.remove('correct');
					}
				});
				clicked = false;
				button.classList.remove('show');
				buttons.forEach(btn => (btn.textContent = 'Loading...'));
				const loader = createLoader();
				gistContainer.append(loader);
				getGists().then(displayGist);
			};
			continueBtn.addEventListener('click', () => {
				getGitstsAfterScoreUpdated(continueBtn);
			});
			retryButton.addEventListener('click', () => {
				getGitstsAfterScoreUpdated(retryButton);
			});