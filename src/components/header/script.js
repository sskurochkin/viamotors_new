window.addEventListener('load', function () {


	(function () {
		let div = document.createElement('div')

		div.style.overflowY = 'scroll'
		div.style.width = '50px'
		div.style.height = '50px'

		// мы должны вставить элемент в документ, иначе размеры будут равны 0
		document.body.append(div)
		let scrollWidth = div.offsetWidth - div.clientWidth

		div.remove()
		document.documentElement.style.setProperty(
			'--scrollWidth',
			scrollWidth + 'px'
		)
	})();

	const arrow = document.querySelector('.hero-arrow')
	arrow?.addEventListener('click', ()=>{
		document.querySelector('.why').scrollIntoView()
	})

	const reviews = document.querySelectorAll('.js-splide-review')


	const config = {
		root: null, // Sets the framing element to the viewport
		rootMargin: "200px",
		threshold: 0.5
	}


	const sliderObserver = new IntersectionObserver((entries, observer) =>{
		entries.forEach(el=>{
			if(el.isIntersecting){
				if(el.target.classList.contains('inited')) {
					return
				}

				let splideRoof = new Splide(el.target, {
					// type: 'loop',
					lazy: 'sequential',
					perPage: 2,
					perMove: 1,
					gap: '2.4rem',
					drag: true,
					speed: 1000,
					pagination: true,
					arrows: true,
					lazyLoad: 'sequential',
					breakpoints:{
						575:{
							perPage: 1,
							arrows: false
						}
					}

				}).mount();

				el.target.classList.add('inited');

			}
		}, config)
	})

	reviews?.forEach(el=>{

		sliderObserver.observe(el)
	})

	document.addEventListener('scroll', () => {
		if (window.pageYOffset > window.innerHeight) {
			document.querySelector('.back-to-top')?.classList.add('active');
		} else {
			document.querySelector('.back-to-top')?.classList.remove('active');
		}
	})

	document.querySelector('.back-to-top')?.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	});


	(() => {


		if (!window.Validator) {
			window.Validator = class Validator {

				constructor(form) {
					this.isLiveValidation = true;
					this.form = form;
					this.formTouched = false;
					this.fields = [];
					if(form.Validator){
						form.Validator.destroy();
					}
					this.init();
					form.Validator = this;
					this.topOffset  = document.querySelector('.header-sticky__inner')?.getBoundingClientRect().height || 0;
				}

				init() {
					this.liveValidationHandler = this.liveValidate.bind(this);
					this.submitHandlerBinded = this.submitHandler.bind(this);
					this.form.setAttribute('novalidate', 'novalidate');
					this.form.classList.add('validator-initialized');
					this.setHelpBlocks();
					this.submit();
					this.parseFields();
					this.initLiveValidation();
				}

				destroy() {
					this.initLiveValidation(true);
					this.formTouched = false;
					this.fields = [];
					this.form.removeAttribute('novalidate');
					this.form.classList.remove('validator-initialized');
					[...this.form.querySelectorAll('.help-block')].forEach(x => x.remove());
					[...this.form.querySelectorAll('.form-group')].forEach(x => x.classList.remove('has-error'));
					this.removeListeners();
				}

				removeListeners() {
					[...this.form.querySelectorAll('.form-control, .form-control-small')].forEach(x => {
						x.removeEventListener('input', this.liveValidationHandler);
						x.removeEventListener('change', this.liveValidationHandler);
					})
					this.form.removeEventListener('submit', this.submitHandlerBinded)
				}

				reinit() {
					this.init();
				}

				addValidator(name, message, func) {
					const fieldRef = this.fields.find(x => x.name === name);
					const validator = {
						status: 'NOT_VALIDATE',
						message,
						validator: func
					}
					if (fieldRef) {
						fieldRef.validators.push(validator)
					} else {
						this.fields.push({
							name,
							validators: [validator]
						})
					}
				}

				removeValidator(name) {
					const validatorRef = this.fields.find(x => x.name === name)
					validatorRef && (validatorRef.validators = []);
					this.validateFields();
				}


				parseFields() {
					[...this.form.querySelectorAll('.form-control, .form-control-small')].forEach(x => {

						const name = x.getAttribute('name');
						const requiredValidator = x.hasAttribute('required');
						const patternValidator = x.hasAttribute('pattern');
						const message = x.getAttribute('data-bv-notempty-message')?.trim() || 'Обязательное поле';
						const regexpMessage = x.getAttribute('data-bv-regexp-message')?.trim() || 'Неверный формат';
						if (requiredValidator) {
							this.addValidator(name, message, (value) => {

								value = typeof value == 'string' ? value.trim() : value;

								if (value) {
									return true;
								} else {
									return false;
								}
							})
						}
						if (patternValidator) {
							this.addValidator(name, regexpMessage, (value) => {
								const pattern = this.form.querySelector(`[name="${name}"]`)?.getAttribute('pattern');
								const regexp = new RegExp(pattern)
								const res = value.match(regexp, 'gm');
								if (res) {
									return true;
								} else {
									return false;
								}
							})
						}
						if (x.getAttribute('type') === 'email' && !x.hasAttribute('pattern')) {
							this.addValidator(x.name, 'Неверный формат', (value) => {
								const isValid = value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]*\.[a-z]{2,4}$/g);
								if (isValid) {
									return true;
								} else {
									return false;
								}
							})
						}
						if (x.getAttribute('type') === 'tel' && !x.hasAttribute('pattern')) {
							this.addValidator(x.name, 'Неверный формат', (value) => {
								const isValid = value.match(/\+[0-9]{3} \([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/);
								if (isValid) {
									return true;
								} else {
									return false;
								}
							})
						}
					})
				}

				initLiveValidation() {
					if (this.isLiveValidation) {
						[...this.form.querySelectorAll('.form-control, .form-control-small')].forEach(x => {
							x.addEventListener('input', this.liveValidationHandler)
							x.addEventListener('change', this.liveValidationHandler)
						})
					}
				}

				liveValidate() {
					if (this.formTouched) {
						this.validateFields()
					}
				}

				validateFields() {

					let isValid = true;

					this.fields.forEach((x) => {

						const name = x.name;
						const input = this.form.querySelector(`[name="${name}"]`);
						const value = input.type === 'checkbox' ? input.checked : input.value;
						for (let i = 0; i < x.validators.length; i++) {
							const validatorObj = x.validators[i];
							if (validatorObj.validator(value)) {
								validatorObj.status = 'VALID'
							} else {
								validatorObj.status = 'INVALID'
							}
						}
					})

					this.showMessage();

					this.fields.forEach(x => {
						x.validators.forEach(x => {
							if (x.status === 'INVALID') {
								isValid = false
							}
						})
					})



					return isValid;
				}


				showMessage() {
					this.fields.forEach(x => {
						const formGroup = this.form.querySelector(`[name="${x.name}"]`).closest('.form-group');
						if (!x.validators.length) {
							formGroup.classList.remove('has-error');
							formGroup.querySelector('.help-block').classList.add('hidden');
							return;
						}
						for (let i = 0; i < x.validators.length; i++) {
							const status = x.validators[i].status;
							const message = x.validators[i].message;
							if (status === 'INVALID') {
								formGroup.classList.add('has-error');
								formGroup.querySelector('.help-block').innerText = message;
								formGroup.querySelector('.help-block').classList.remove('hidden');
								break;
							} else {
								formGroup.classList.remove('has-error');
								formGroup.querySelector('.help-block').classList.add('hidden');
							}
						}
					})
				}

				submit() {

					this.form.addEventListener('submit', this.submitHandlerBinded)
				}

				submitHandler(ev) {
					this.formTouched = true;
					ev.preventDefault();
					const isValid = this.validateFields();
					if (!isValid) {
						const target = this.form.querySelector('.form-group.has-error');
						if (target !== null && !target.closest('.modal')) {
							const diff = (target.getBoundingClientRect().top + window.pageYOffset)- this.topOffset
							window.scrollTo({
								top: diff,
								behavior: 'smooth'
							})
						}
						return;
					};
					this.form.dispatchEvent(new Event('success.validator', { "bubbles": true }))
				}

				setHelpBlocks() {
					const formGroups = [...this.form.querySelectorAll('.form-group')]
					formGroups.forEach(x => {
						const helpBlock = document.createElement('div');
						helpBlock.classList.add('help-block');
						helpBlock.classList.add('hidden');
						helpBlock.innerText = 'Ошибка валидации';
						x.append(helpBlock);
					})
				}
			}
		}

	})();

	(() => {



		const tokens = {
			"_": { pattern: /[0-9]/ },
			"@": { pattern: /[a-zA-Z]/ },
			"*": { pattern: /[a-zA-Z0-9]/ }
		}

		const parseJson = value => JSON.parse(value.replaceAll("'", '"'))

		const parseInput = (input, defaults = {}) => {
			const opts = { ...defaults }

			if (input.dataset.maska != null && input.dataset.maska !== "") {
				opts.mask = parseMask(input.dataset.maska)
			}
			if (input.dataset.maskaEager != null) {
				opts.eager = parseOpts(input.dataset.maskaEager)
			}
			if (input.dataset.maskaReversed != null) {
				opts.reversed = parseOpts(input.dataset.maskaReversed)
			}
			if (input.dataset.maskaTokensReplace != null) {
				opts.tokensReplace = parseOpts(input.dataset.maskaTokensReplace)
			}
			if (input.dataset.maskaTokens != null) {
				opts.tokens = parseTokens(input.dataset.maskaTokens)
			}

			return opts
		}

		const parseOpts = value => (value !== "" ? Boolean(JSON.parse(value)) : true)

		const parseMask = value =>
			value.startsWith("[") && value.endsWith("]") ? parseJson(value) : value

		const parseTokens = value => {
			if (value.startsWith("{") && value.endsWith("}")) {
				return parseJson(value)
			}

			const tokens = {}
			value.split("|").forEach(token => {
				const parts = token.split(":")
				tokens[parts[0]] = {
					pattern: new RegExp(parts[1]),
					optional: parts[2] === "optional",
					multiple: parts[2] === "multiple",
					repeated: parts[2] === "repeated"
				}
			})

			return tokens
		}

		class MaskInput {
			items = new Map()

			constructor(target, options = {}) {
				this.options = options
				if (typeof target === "string") {
					this.init(
						Array.from(document.querySelectorAll(target)),
						this.getMaskOpts(options)
					)
				} else {
					this.init(
						"length" in target ? Array.from(target) : [target],
						this.getMaskOpts(options)
					)
				}
			}

			destroy() {
				for (const input of this.items.keys()) {
					input.removeEventListener("input", this.inputEvent)
					input.removeEventListener("beforeinput", this.beforeinputEvent)
				}
				this.items.clear()
			}

			needUpdateOptions(input, opts) {
				const mask = this.items.get(input)
				const maskNew = new Mask(parseInput(input, this.getMaskOpts(opts)))

				return JSON.stringify(mask.opts) !== JSON.stringify(maskNew.opts)
			}

			needUpdateValue(input) {
				const value = input.dataset.maskaValue

				return (
					(value == null && input.value !== "") ||
					(value != null && value !== input.value)
				)
			}

			getMaskOpts(options) {
				const { onMaska, preProcess, postProcess, ...opts } = options

				return opts
			}

			init(inputs, defaults) {
				for (const input of inputs) {
					const mask = new Mask(parseInput(input, defaults))
					this.items.set(input, mask)

					if (input.value !== "") {
						this.setMaskedValue(input, input.value)
					}

					input.addEventListener("input", this.inputEvent)
					input.addEventListener("beforeinput", this.beforeinputEvent)
				}
			}

			beforeinputEvent = e => {
				const input = e.target
				const mask = this.items.get(input)

				// delete first character in eager mask when it's the only left
				if (
					mask.isEager() &&
					"inputType" in e &&
					e.inputType.startsWith("delete") &&
					mask.unmasked(input.value).length <= 1
				) {
					this.setMaskedValue(input, "")
				}
			}

			inputEvent = e => {
				if (
					e instanceof CustomEvent &&
					e.type === "input" &&
					e.detail != null &&
					typeof e.detail === "object" &&
					"masked" in e.detail
				) {
					return
				}

				const input = e.target
				const mask = this.items.get(input)
				const valueOld = input.value
				const ss = input.selectionStart
				const se = input.selectionEnd
				let value = valueOld

				if (mask.isEager()) {
					const masked = mask.masked(valueOld)
					const unmasked = mask.unmasked(valueOld)

					if (unmasked === "" && "data" in e && e.data != null) {
						// empty state and something like `space` pressed
						value = e.data
					} else if (unmasked !== mask.unmasked(masked)) {
						value = unmasked
					}
				}

				this.setMaskedValue(input, value)

				// set caret position
				if ("inputType" in e) {
					if (
						e.inputType.startsWith("delete") ||
						(ss != null && ss < valueOld.length)
					) {
						try {
							// see https://github.com/beholdr/maska/issues/118
							input.setSelectionRange(ss, se)
						} catch { }
					}
				}
			}

			setMaskedValue(input, value) {
				const mask = this.items.get(input)

				if (this.options.preProcess != null) {
					value = this.options.preProcess(value)
				}

				const masked = mask.masked(value)
				const unmasked = mask.unmasked(mask.isEager() ? masked : value)
				const completed = mask.completed(value)
				const detail = { masked, unmasked, completed }

				value = masked

				if (this.options.postProcess != null) {
					value = this.options.postProcess(value)
				}

				input.value = value
				input.dataset.maskaValue = value

				if (this.options.onMaska != null) {
					if (Array.isArray(this.options.onMaska)) {
						this.options.onMaska.forEach(f => f(detail))
					} else {
						this.options.onMaska(detail)
					}
				}
				input.dispatchEvent(new CustomEvent("maska", { detail }))
				input.dispatchEvent(new CustomEvent("input", { detail }))
			}
		}

		class Mask {
			opts = {}
			memo = new Map()

			constructor(defaults = {}) {
				const opts = { ...defaults }

				if (opts.tokens != null) {
					opts.tokens = opts.tokensReplace
						? { ...opts.tokens }
						: { ...tokens, ...opts.tokens }

					for (const token of Object.values(opts.tokens)) {
						if (typeof token.pattern === "string") {
							token.pattern = new RegExp(token.pattern)
						}
					}
				} else {
					opts.tokens = tokens
				}

				if (Array.isArray(opts.mask)) {
					if (opts.mask.length > 1) {
						opts.mask.sort((a, b) => a.length - b.length)
					} else {
						opts.mask = opts.mask[0] ?? ""
					}
				}
				if (opts.mask === "") {
					opts.mask = null
				}

				this.opts = opts
			}

			masked(value) {
				return this.process(value, this.findMask(value))
			}

			unmasked(value) {
				return this.process(value, this.findMask(value), false)
			}

			isEager() {
				return this.opts.eager === true
			}

			isReversed() {
				return this.opts.reversed === true
			}

			completed(value) {
				const mask = this.findMask(value)
				if (this.opts.mask == null || mask == null) return false

				const length = this.process(value, mask).length

				if (typeof this.opts.mask === "string") {
					return length >= this.opts.mask.length
				} else if (typeof this.opts.mask === "function") {
					return length >= mask.length
				} else {
					return (
						this.opts.mask.filter(m => length >= m.length).length ===
						this.opts.mask.length
					)
				}
			}

			findMask(value) {
				const mask = this.opts.mask
				if (mask == null) {
					return null
				} else if (typeof mask === "string") {
					return mask
				} else if (typeof mask === "function") {
					return mask(value)
				}

				const l = this.process(value, mask.slice(-1).pop() ?? "", false)

				return (
					mask.find(el => this.process(value, el, false).length >= l.length) ?? ""
				)
			}

			escapeMask(maskRaw) {
				const chars = []
				const escaped = []
				maskRaw.split("").forEach((ch, i) => {
					if (ch === "!" && maskRaw[i - 1] !== "!") {
						escaped.push(i - escaped.length)
					} else {
						chars.push(ch)
					}
				})

				return { mask: chars.join(""), escaped }
			}

			process(value, maskRaw, masked = true) {
				if (maskRaw == null) return value

				const key = `value=${value},mask=${maskRaw},masked=${masked ? 1 : 0}`
				if (this.memo.has(key)) return this.memo.get(key)

				const { mask, escaped } = this.escapeMask(maskRaw)
				const result = []
				const tokens = this.opts.tokens != null ? this.opts.tokens : {}
				const offset = this.isReversed() ? -1 : 1
				const method = this.isReversed() ? "unshift" : "push"
				const lastMaskChar = this.isReversed() ? 0 : mask.length - 1

				const check = this.isReversed()
					? () => m > -1 && v > -1
					: () => m < mask.length && v < value.length

				const notLastMaskChar = m =>
					(!this.isReversed() && m <= lastMaskChar) ||
					(this.isReversed() && m >= lastMaskChar)

				let lastRawMaskChar
				let repeatedPos = -1
				let m = this.isReversed() ? mask.length - 1 : 0
				let v = this.isReversed() ? value.length - 1 : 0

				while (check()) {
					const maskChar = mask.charAt(m)
					const token = tokens[maskChar]
					const valueChar =
						token?.transform != null
							? token.transform(value.charAt(v))
							: value.charAt(v)

					if (!escaped.includes(m) && token != null) {
						if (valueChar.match(token.pattern) != null) {
							result[method](valueChar)

							if (token.repeated) {
								if (repeatedPos === -1) {
									repeatedPos = m
								} else if (m === lastMaskChar && m !== repeatedPos) {
									m = repeatedPos - offset
								}

								if (lastMaskChar === repeatedPos) {
									m -= offset
								}
							} else if (token.multiple) {
								m -= offset
							}

							m += offset
						} else if (token.multiple) {
							const hasValue = result[v - offset]?.match(token.pattern) != null
							const nextMask = mask.charAt(m + offset)
							if (hasValue && nextMask !== "" && tokens[nextMask] == null) {
								m += offset
								v -= offset
							} else {
								result[method]("")
							}
						} else if (valueChar === lastRawMaskChar) {
							// matched the last untranslated (raw) mask character that we encountered
							// likely an insert offset the mask character from the last entry;
							// fall through and only increment v
							lastRawMaskChar = undefined
						} else if (token.optional) {
							m += offset
							v -= offset
						} else {
							// invalid input
						}

						v += offset
					} else {
						if (masked && !this.isEager()) {
							result[method](maskChar)
						}

						if (valueChar === maskChar && !this.isEager()) {
							v += offset
						} else {
							lastRawMaskChar = maskChar
						}

						if (!this.isEager()) {
							m += offset
						}
					}

					if (this.isEager()) {
						while (
							notLastMaskChar(m) &&
							(tokens[mask.charAt(m)] == null || escaped.includes(m))
							) {
							if (masked) {
								result[method](mask.charAt(m))
							} else if (mask.charAt(m) === value.charAt(v)) {
								v += offset
							}
							m += offset
						}
					}
				}

				this.memo.set(key, result.join(""))

				return this.memo.get(key)
			}
		}

		if (!window.Mask) {

			window.Mask = class Mask {


				constructor(form) {
					this.form = form;
					this.controllers = [];
					this.init();
					this.form.Mask = this;
				}

				init() {
					this.form?.querySelectorAll('[data-mask]').forEach(x => {
						const mask = x.getAttribute('type') == 'tel' ? '+375 (__) ___-__-__'  : x.getAttribute('data-mask');
						// const name = x.getAttribute('name');
						if (!mask) return;
						const controller = new MaskInput(x, {
							mask: mask,
						})
						this.controllers.push(controller);
					})
				}

				addValidator(name, func) {
					if (this.form.Validator) {
						this.form.Validator.addValidator(name, 'Неверный формат', func)
					}
				}


				destroy() {
					if (this.controllers?.length) {
						while (this.controllers.length) {
							this.controllers.pop().destroy();
						}
					}
				}

			}
		}



	})();

	document.querySelectorAll('.form-validate').forEach(el=>{
		new Validator(el)
	})
	document.querySelectorAll('form.form-validate').forEach((x) => {
		new Mask(x)
	})

	const vocabulary = {


				text: 'Для работы сайта используются технические, аналитические и функциональные cookie-файлы. Нажимая кнопку "Принять все", вы даете согласие на обработку всех cookie-файлов. <a href="https://tmdesign.by/cookie">Подробнее об обработке</a>',
				name: 'Установка счетчиков',
				items: [
					{
						code: "TECH",
						checked: true,
						disable: true,
						name: 'Технические (обязательные) cookie',
						text: 'Вы можете настроить использование каждой категории cookie-файлов, за исключением категории "Технические (обязательные) cookie-файлы", поскольку они необходимы для надлежащего функционирования сайта и не требуют согласия.'
					},
					{
						code: "FUNCTIONAL",
						checked: false,
						name: 'Функциональные cookie',
						text: 'Являются критически важными для работы отдельных страниц сайта и обеспечивают работу полезных функций.'
					},
					{
						code: "ANALYTICS",
						checked: false,
						name: 'Аналитические cookie',
						text: 'Сбор аналитической информации с помощью Google Analytics и Яндекс.Метрика позволит проанализировать ваше взаимодействие с нашим сайтом и сервисом в целях оценки и улучшения работы нашего сайта.<br>Отключение аналитических cookie-файлов не позволит определить ваши предпочтения, сделать сайт удобнее.'
					},
				],
				notification: {
					btn_accept: 'Принять все',
					btn_cancel: 'Отклонить',
					btn_tune: 'Настроить',
					btn_save: 'Сохранить',
					text: 'Для реализации основных функций сайта, а также для сбора данных о том, как посетители взаимодействуют с сайтом, мы используем cookies-файлы.<br>Изменить выбор настроек обработки cookie-файлов или отозвать согласие можно в интерфейсе сайта (кнопка "Настроить обработку cookie-файлов"). Для получения подробной информации об обработке cookie-файлов на нашем сайте и механизме реализации прав смотрите по ссылке <a href="https://tmdesign.by/cookie" target="_blank">"Обработка cookie-файлов"</a>.'
				},
				set_btn: 'Настроить обработку cookie-файлов'



	}


	const cookieApp = {
		init() {
			this.currentCookie = JSON.parse(this.getCookie("cookie_agree") || null);

			if(this.currentCookie){
				Object.keys(this.currentCookie).forEach(x=>{

					if(x){
						vocabulary.items.forEach(item=>{
							if(x===item.code){
								item.checked = this.currentCookie[x]
							}
						})
					}
				})
			}


			this.render();

			this.setListeners();

			if (!this.currentCookie) this.showPopup();


		},

		cookieObj:{
		},

		settings:{
			expires: 31104000,
		},

		response:{ ...vocabulary, block: true, base_color: '#f09a9a' },

		render() {
			try {

				const {text, name, items, notification, block, show_icon} =
					this.response;
				this.html = document.createElement("div");
				this.container = document.createElement("div");
				this.container.classList.add("cookie-notification-wrapper");
				if (block) {
					this.container.classList.add("blocked");
				}

				if (this.response.base_color) {
					this.container.style.setProperty(
						"--base-color",
						this.response.base_color
					);
				}

				this.container.innerHTML = `
					 <div class="cookie-notification">
							<div class="cookie-notification-wrap">
								 <div class="cookie-notification__inner">
									  <div class="cookie-notification__header">${text}</div>
									  <form class="cookie-notification__body">
											<div class="cookie-notification__title fz_heading_3 fw-600">${name}</div>
											<div class="cookie-notification__flex">
												${items
					.map(
						({
							 code,
							 name,
							checked,
							 disable,
							 text,
						 }) => `
													<div class="cookie-notification__form-control">
													<div class="cookie-notification__checkbox">
														 <input class="form-control" type="checkbox" ${checked ? 'checked' : ''} id="${code}" name="${code}"  ${
							disable
								? 'checked disabled="disabled"'
								: ''
						}">
														 <label for="${code}" class="cookie-notification__checkbox-label fw-600">${name}</label>
													</div>
													<div >${text || ''}</div>
													</div>
												`
					)
					.join('')}
												 <div class="cookie-notification__mini fz_mini">${notification.text}</div>
											</div>
									  </form>
									  <div class="cookie-notification__footer">
									  		<div class="cookie-notification__control cookie-notification__control--approve base">${notification.btn_accept}</div>
											<div class="cookie-notification__control cookie-notification__control--approve set">${notification.btn_save}</div>

									  		<div class="cookie-notification__control cookie-notification__control--cancel">${notification.btn_cancel}</div>
											
											<div class="cookie-notification__settings cookie-notification__control--settings">
												<div class="cookie-notification__control">${notification.btn_tune}</div>
											</div
										</div>
								 </div>
							</div>
					 </div>
				 `
				document.querySelector("body").append(this.html);
				this.html.appendChild(this.container);
				this.renderSettingsButton();
			} catch (error) {
			}
		},

		setListeners() {
			const apptoveBtn = this.container.querySelectorAll(
				'.cookie-notification__control--approve'
			)
			const cancelBtn = this.container.querySelector(
				'.cookie-notification__control--cancel'
			)
			const settingsBtn = this.container.querySelector(
				'.cookie-notification__control--settings'
			)
			apptoveBtn.forEach(x=>x.addEventListener('click', () => {
				this.accept(x.classList.contains('base'))
			}))
			cancelBtn.addEventListener('click', () => this.decline())
			settingsBtn.addEventListener('click', () => this.showSettings())
			this.container.querySelectorAll("input:not([disabled])").forEach((x) => {
				x.addEventListener("change", () => {
					const id = x.getAttribute("id");
					const checked = x.checked;
					this.onInputHandler(id, checked);
				});
			});
		},

		accept(force) {
			if (force) {
				this.response.items.forEach(({code}) => {
					this.cookieObj[code] = true;
				});
			}
			this.writeAgreeCookies({...this.currentCookie, ...this.cookieObj });
			this.closePopup();
			if (this.isDirty || this.currentCookie) {
				return window.location.reload();
			} else {
				// this.loadAssets();
				this.isDirty = true;
			}
		},
		decline() {
			this.response.items
				.filter((x) => !x.disable)
				.forEach(({code}) => {
					this.cookieObj[code] = false;
				});
			this.writeAgreeCookies(this.cookieObj);
			this.closePopup();
			if (this.isDirty || this.currentCookie) {
				window.location.reload();
			} else {
				this.isDirty = true;
			}
		},

		writeAgreeCookies(obj) {
			const {expires} = this.settings;
			this.setCookie("cookie_agree", JSON.stringify(obj), {
				expires,
				domain: window.location.hostname,
				path: "/",
			});
		},

		getCookie(name) {
			const matches = document.cookie.match(
				new RegExp(
					"(?:^|; )" +
					name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
					"=([^;]*)"
				)
			);
			return matches ? decodeURIComponent(matches[1]) : undefined;
		},

		setCookie(name, value, options) {
			options = options || {};
			var expires = options.expires;
			if (typeof expires == "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}
			value = encodeURIComponent(value);
			var updatedCookie = name + "=" + value;
			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}
			document.cookie = updatedCookie;
		},

		onInputHandler(id, checked) {
			this.cookieObj[id] = checked;

		},


		showPopup() {
			this.container.classList.add("visible");
		},
		closePopup() {
			this.container.classList.remove("visible");
		},
		showSettings() {
			this.showPopup()
			this.container
				.querySelector('.cookie-notification__body')
				.classList.add('visible')
			this.container.classList.add('setting')
			this.container
				.querySelector('.cookie-notification__header')
				.classList.add('hidden')
			this.container
				.querySelector('.cookie-notification__settings')
				.classList.add('hidden')
		},
		renderSettingsButton(mob=false) {
			this.settingsButton = document.querySelector(".cookie-setting");

			this.settingsButton?.addEventListener("click", () => this.showSettings());


		},


	};

	window.cookieApp = cookieApp;
	window.cookieApp.init();


})

window.addEventListener('alpine:init', function () {

	Alpine.data('price', () => ({

		modal: false,
		policy: false,
		amount: null,
		form : null,
		success: false ,
		errorMessage: '',
		errorCode: '',


		init() {
			this.form = this.$refs.form
			this.success = false
			this.form.addEventListener('success.validator', async()=>{
				await this.sendRequest()
			})

		},

		async sendRequest(){
			const data = new FormData(this.form)


			try {
				const response = await fetch('/payment.php', {
					method: 'POST',
					body: data
				})

				const {formUrl, ...rest} = await response.json()

				if(formUrl){
					this.success = true

					setTimeout(()=>{
						this.closePopup()
						this.$nextTick(()=>{
							window.location.href = formUrl
						})

					}, 1500)

					// this.paymentWindow(formUrl, 'Оплата' ,460, 700)

				}

				if(rest.errorMessage){
					this.errorMessage = rest.errorMessage
					this.errorCode = rest.errorCode
				}



			} catch(e){
				console.log(e)
			} finally {

			}

		},

		sendToTg(data){

		},

		paymentWindow(target_url, win_name, width, height){

				let socWinOpen = window.open(target_url, win_name, 'scrollbars=yes,statusbar=no,toolbar=no,location=no,directories=no,resizable=no,menubar=no,width='+width+',height='+height+',screenX='+((screen.width-width) / 2)+",screenY="+((screen.height-height) / 2)+",top="+((screen.height-height) / 2)+",left="+((screen.width-width) / 2));
				socWinOpen.focus();

		},


		openPopup(id){
			this.modal = true
			this.amount = +id*100
			document.querySelector('body').classList.add('overflow')
		},

		closePopup(){
			this.modal = false
			this.amount = false

			document.querySelector('body').classList.remove('overflow')
			setTimeout(()=>{
				this.errorMessage = ''
				this.errorCode = ''
				this.success = false
				this.form.reset()
			}, 600)
		},




	}))

})




