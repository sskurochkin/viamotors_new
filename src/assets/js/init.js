const uiInits = {
	init: function () {
		this.browserCheck();
		this.vendorLoader();
		this.scrollWidth();
		this.modals();
		this.validation();
		this.base();
		this.usa();
		this.calc()
	},

	browserCheck: function () {
		// проверка браузера
		const userAgent = navigator.userAgent;
		if (userAgent.indexOf("Firefox") > -1) {
			// "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
			document.querySelector('body').classList.add('browser-mozzila');
		} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
			//"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
			document.querySelector('body').classList.add('browser-opera');
		} else if (userAgent.indexOf("Trident") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
			document.querySelector('body').classList.add('browser-ie');
		} else if (userAgent.indexOf("Edge") > -1) {
			// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
			document.querySelector('body').classList.add('browser-edge');
		} else if (userAgent.indexOf("Chrome") > -1) {
			// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
			document.querySelector('body').classList.add('browser-chrome');
		} else if (userAgent.indexOf("Safari") > -1) {
			// "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
			document.querySelector('body').classList.add('browser-safari');
		}
		// проверка на МАС платформу
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
			document.querySelector('body').classList.add('platform-mac');
		}
	},
	vendorLoader: function () {

		const vendorloadStatus = {};

		window.vendorLoadStatus = vendorloadStatus;

		window.vendorLoader = function (args = {}) {
			if (!args.name) {
				console.warn('vendorLoader: You must pass the name!');
				return;
			}
			if (!args.path) {
				console.warn('vendorLoader: You must pass the path!');
				return;
			}

			!window.vendor && (window.vendor = {});
			!window.SITE_TEMPLATE_PATH && (window.SITE_TEMPLATE_PATH = '/');

			window.vendor[args.name] = {};
			window.vendor[args.name].load = {};
			window.vendor[args.name].load.timeout;
			/*if (!vendorloadStatus[args.name]) {
				vendorloadStatus[args.name] = {};
				vendorloadStatus[args.name].load = {};
				vendorloadStatus[args.name].load.timeout = {};
				vendorloadStatus[args.name].load.status = false
			}
			vendorloadStatus[args.name].load.loading = function () {
				if (!vendorloadStatus[args.name].load.status) {
					vendorloadStatus[args.name].load.status = true
					clearTimeout(vendorloadStatus[args.name].load.timeout);
					$(document).off('scroll.vendor-' + args.name);
					$(document).off('click.vendor-' + args.name);
					$(document).off('mouseover.vendor-' + args.name);
					$.getScript((!args.http ? window.SITE_TEMPLATE_PATH : '') + args.path, args.callback || function () { });
				}

			};

			if (args.event.scroll) {
				$(document).on('scroll.vendor-' + args.name, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.click) {
				$(document).on('click.vendor-' + args.name, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.mouseover) {
				$(document).on('mouseover.vendor-' + args.name, args.event.mouseover.trigger, function () {
					vendorloadStatus[args.name].load.loading();
				});
			}

			if (args.event.timeout) {
				vendorloadStatus[args.name].load.timeout = setTimeout(function () {
					vendorloadStatus[args.name].load.loading();
				}, args.timeout || 3000)
			}*/
		}
	},
	scrollWidth: function () {
		if (document.body.scrollHeight <= window.innerHeight) {
			document.documentElement.style.setProperty('--scrollWidth', 0 + 'px');
		} else {
			let div = document.createElement('div');

			div.style.overflowY = 'scroll';
			div.style.width = '50px';
			div.style.height = '50px';

			// мы должны вставить элемент в документ, иначе размеры будут равны 0
			document.body.append(div);
			let scrollWidth = div.offsetWidth - div.clientWidth;

			div.remove();
			document.documentElement.style.setProperty('--scrollWidth', scrollWidth + 'px');
		}
	},
	modals() {
		class Modal {
			TRANSITION_TIME = 300;

			constructor(modalId) {
				this.element = document.getElementById(modalId);
				this.backdrop = document.createElement('div');

				if (!this.element || document.getElementById(modalId).modal) return;

				const modal = (param, options = undefined) => {
					if (param === 'hide') {
						if (options?.immediately) {
							return this.hide(true);
						} else {
							return this.hide();
						}

					}
					this.show();
				}

				document.getElementById(modalId).modal = modal

				if (window.jQuery) {
					jQuery.fn.modal = function (...args) {
						this[0].modal(...args);
						return this;
					};
				}


				this.element.querySelectorAll('[data-dismiss]')?.forEach(x => {
					x.addEventListener('click', () => {
						this.hide();
					})
				})

				this.element.addEventListener('mousedown', (ev) => {
					if (ev.target.closest('.modal-content')) return;
					this.hide();
				})

				document.addEventListener('keydown', evt => {
					if (evt.key === 'Escape') {
						this.hide();
					}
				});
			}

			addBackdrop() {
				this.backdrop.classList.add('modal-backdrop');
				this.backdrop.classList.add('fade');
				document.querySelector('body').append(this.backdrop);
				setTimeout(() => {
					this.backdrop.classList.add('show');
					this.backdrop.classList.add('in');
				}, 0)
			}

			removeBackdrop(immediately = undefined) {
				if (immediately) {
					this.backdrop.remove();
				} else {

					this.backdrop.classList.remove('in');
					setTimeout(() => {
						this.backdrop.classList.remove('show');
						this.backdrop.remove();
					}, this.TRANSITION_TIME)
				}
			}

			show() {
				this.element.style.display = 'block';
				document.querySelector('body').style.paddingRight = Modal.getScrollWidth() + 'px';
				document.querySelector('body').classList.add('modal-open');
				this.element.classList.add('show');
				this.element.classList.add('in');
				this.addBackdrop();
				setTimeout(() => {
					this.element.dispatchEvent(new Event('XModalShow', {bubbles: true}))
				})
			}

			hide(immediately = undefined) {
				if (immediately) {
					this.removeBackdrop(true);
					this.element.style.display = 'none';
					document.querySelector('body').style.paddingRight = null;
					document.querySelector('body').classList.remove('modal-open');
					this.element.classList.remove('show');
					this.element.classList.remove('in');
					setTimeout(() => {
						document.dispatchEvent(new Event('XModalHide'))
					})
				} else {
					this.element.classList.remove('show');
					this.element.classList.remove('in');
					this.removeBackdrop();
					setTimeout(() => {
						this.element.style.display = 'none';
						document.querySelector('body').style.paddingRight = null;
						document.querySelector('body').classList.remove('modal-open');
						setTimeout(() => {
							document.dispatchEvent(new Event('XModalHide'))
						})
					}, this.TRANSITION_TIME * 0.8)
				}

			}
		}

		Modal.getScrollWidth = () => {
			if (document.body.scrollHeight <= window.innerHeight) {
				return 0
			} else {
				let div = document.createElement('div');
				div.style.overflowY = 'scroll';
				div.style.width = '50px';
				div.style.height = '50px';
				document.body.append(div);
				let scrollWidth = div.offsetWidth - div.clientWidth;
				div.remove();
				return scrollWidth;
			}
		}

		(!window.reinit && (window.reinit = {}));

		window.reinit.modals = () => {
			if (window.jQuery && window.jQuery().modal) return;

			[...document.querySelectorAll('.modal')].forEach((x) => {

				const modalId = x.getAttribute('id').split('#').join('');
				new Modal(modalId);
			});

			[...document.querySelectorAll('[data-target][data-toggle="modal"]')].forEach((x) => {
				const modalId = x.getAttribute('data-target').split('#').join('');
				const modal = document.getElementById(modalId);
				x.addEventListener('click', (e) => {

					modal.classList.remove('ta-hidden')

					const text = e.target?.innerText || ''
					const mess = e.target?.dataset.heading || ''

					if(mess){
						modal.classList.add('ta-hidden')
						modal.querySelector('textarea').value = mess
					}
					modal.querySelector('.modal-title').innerText = text
					modal?.modal && modal.modal();
				})
			})
		}

		window.reinit.modals();

		window.XModal = Modal;
	},
	validation() {
		(() => {

			if (!window.Validator) {
				window.Validator = class Validator {

					constructor(form) {
						this.isLiveValidation = true;
						this.form = form;
						this.formTouched = false;
						this.fields = [];
						if (form.Validator) {
							form.Validator.destroy();
						}
						this.init();
						form.Validator = this;
						this.modal = form.closest('.modal')
						this.topOffset = document.querySelector('.header-sticky__inner')?.getBoundingClientRect().height || 0;
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
							status: 'NOT_VALIDATE', message, validator: func
						}
						if (fieldRef) {
							fieldRef.validators.push(validator)
						} else {
							this.fields.push({
								name, validators: [validator]
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

							// if (x.getAttribute('type') === 'email' && !x.hasAttribute('pattern')) {
							// 	this.addValidator(x.name, 'Неверный формат', (value) => {
							// 		const isValid = value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]*\.[a-z]{2,4}$/g);
							// 		if (isValid) {
							// 			return true;
							// 		} else {
							// 			return false;
							// 		}
							// 	})
							// }
							if (x.getAttribute('type') === 'tel' && !x.hasAttribute('pattern')) {
								this.addValidator(x.name, 'Неверный формат', (value) => {
									const isValid = value.match(/\+375 \([0-9]{2}\) [0-9]{3} [0-9]{2} [0-9]{2}/);
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

					async submitHandler(ev) {
						this.formTouched = true;
						ev.preventDefault();
						const isValid = this.validateFields();
						if (!isValid) {
							const target = this.form.querySelector('.form-group.has-error');
							if (target !== null && !target.closest('.modal')) {
								const diff = (target.getBoundingClientRect().top + window.pageYOffset) - this.topOffset
								window.scrollTo({
									top: diff, behavior: 'smooth'
								})
							}
							return;
						}
						;

						this.form.dispatchEvent(new Event('success.validator', {"bubbles": true}))
						await this.sendForm()
					}

					displayPreloader() {
						this.form.classList.add('preloader')
					}

					hidePreloader() {
						this.form.classList.remove('preloader')
					}

					async sendForm() {
						this.displayPreloader()
						const formData = new FormData(this.form)

						try {
							const response = await fetch(this.form.action, {
								method: "POST",
								body: formData
							})
							const data = await response.json()



							if (data?.success) {

								this.form.reset()
								this.destroy()
								this.init()
								if (this.modal) this.modal.modal('hide')
							}
							setTimeout(() => {
								this.showSuccessMessage(data?.message, data.success)
							}, 400)


						} catch (e) {
							this.showSuccessMessage('Ошибка сервера.</br>Попробуйте позже.', false)
							throw new Error(e)
						} finally {
							this.hidePreloader()
						}
					}

					showSuccessMessage(message, success = true) {
						const modal = document.querySelector('#modal-success')
						const messageInner = modal.querySelector('.modal-title')
						messageInner.style.color = success ? 'green' : 'red'
						messageInner.innerHTML = message

						this.hidePreloader()
						modal.modal()

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
				"_": {pattern: /[0-9]/}, "@": {pattern: /[a-zA-Z]/}, "*": {pattern: /[a-zA-Z0-9]/}
			}

			const parseJson = value => JSON.parse(value.replaceAll("'", '"'))

			const parseInput = (input, defaults = {}) => {
				const opts = {...defaults}

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

			const parseMask = value => value.startsWith("[") && value.endsWith("]") ? parseJson(value) : value

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
						this.init(Array.from(document.querySelectorAll(target)), this.getMaskOpts(options))
					} else {
						this.init("length" in target ? Array.from(target) : [target], this.getMaskOpts(options))
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

					return ((value == null && input.value !== "") || (value != null && value !== input.value))
				}

				getMaskOpts(options) {
					const {onMaska, preProcess, postProcess, ...opts} = options

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
					if (mask.isEager() && "inputType" in e && e.inputType.startsWith("delete") && mask.unmasked(input.value).length <= 1) {
						this.setMaskedValue(input, "")
					}
				}

				inputEvent = e => {
					if (e instanceof CustomEvent && e.type === "input" && e.detail != null && typeof e.detail === "object" && "masked" in e.detail) {
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
						if (e.inputType.startsWith("delete") || (ss != null && ss < valueOld.length)) {
							try {
								// see https://github.com/beholdr/maska/issues/118
								input.setSelectionRange(ss, se)
							} catch {
							}
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
					const detail = {masked, unmasked, completed}

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
					input.dispatchEvent(new CustomEvent("maska", {detail}))
					input.dispatchEvent(new CustomEvent("input", {detail}))
				}
			}

			class Mask {
				opts = {}
				memo = new Map()

				constructor(defaults = {}) {
					const opts = {...defaults}

					if (opts.tokens != null) {
						opts.tokens = opts.tokensReplace ? {...opts.tokens} : {...tokens, ...opts.tokens}

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
						return (this.opts.mask.filter(m => length >= m.length).length === this.opts.mask.length)
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

					return (mask.find(el => this.process(value, el, false).length >= l.length) ?? "")
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

					return {mask: chars.join(""), escaped}
				}

				process(value, maskRaw, masked = true) {
					if (maskRaw == null) return value

					const key = `value=${value},mask=${maskRaw},masked=${masked ? 1 : 0}`
					if (this.memo.has(key)) return this.memo.get(key)

					const {mask, escaped} = this.escapeMask(maskRaw)
					const result = []
					const tokens = this.opts.tokens != null ? this.opts.tokens : {}
					const offset = this.isReversed() ? -1 : 1
					const method = this.isReversed() ? "unshift" : "push"
					const lastMaskChar = this.isReversed() ? 0 : mask.length - 1

					const check = this.isReversed() ? () => m > -1 && v > -1 : () => m < mask.length && v < value.length

					const notLastMaskChar = m => (!this.isReversed() && m <= lastMaskChar) || (this.isReversed() && m >= lastMaskChar)

					let lastRawMaskChar
					let repeatedPos = -1
					let m = this.isReversed() ? mask.length - 1 : 0
					let v = this.isReversed() ? value.length - 1 : 0

					while (check()) {
						const maskChar = mask.charAt(m)
						const token = tokens[maskChar]
						const valueChar = token?.transform != null ? token.transform(value.charAt(v)) : value.charAt(v)

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
							while (notLastMaskChar(m) && (tokens[mask.charAt(m)] == null || escaped.includes(m))) {
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
							const mask = x.getAttribute('data-mask');
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


		document.querySelectorAll('form.form-validate').forEach((x) => {
			new Validator(x)
			new Mask(x)
		})
	},
	base: function () {

		document.querySelector('.burger-icon')?.addEventListener('click', function (){
			this.classList.toggle('active')
			this.closest('.header-nav').classList.toggle('active')
		})

		// const swiper = new Swiper('.swiper', {
		// 	// Optional parameters
		// 	loop: true,
		// 	lazy: true,
		// 	autoplay:{
		// 		delay: 3000
		// 	},
		//
		// 	// If we need pagination
		// 	pagination: {
		// 		el: '.swiper-pagination',
		// 	},
		//
		// 	// Navigation arrows
		// 	navigation: {
		// 		nextEl: '.swiper-button-next',
		// 		prevEl: '.swiper-button-prev',
		// 	},
		//
		// });
		//

	},

	usa: function (){
		// Используем const для переменных, которые не переназначаются
		const blockCountTabProces = document.querySelectorAll(".days-buy li").length;

// Используем let для переменной, которая изменяется
		let activeTabProces = 0;

// Стрелочные функции и деструктуризация
		const updateTabs = (tabIndex) => {
			const tabElement = document.querySelector(`[data-tab="proc-s-${tabIndex}"]`);
			const contentElement = document.querySelector(`.proc-s-${tabIndex}`);
			const prevButton = document.querySelector(".js-prev-proc-b");
			const nextButton = document.querySelector(".js-next-proc-b");

			// Удаляем активный класс у всех элементов
			document.querySelectorAll(".days-buy li, .car-proc").forEach(element => {
				element.classList.remove("active");
			});

			// Добавляем активный класс выбранным элементам
			tabElement?.classList.add("active");
			contentElement?.classList.add("active");

			// Обновляем состояние кнопок
			prevButton?.classList.toggle("disabled", tabIndex === 1);
			nextButton?.classList.toggle("disabled", tabIndex === blockCountTabProces);
		};

// Обработчики событий с стрелочными функциями
		document.querySelectorAll(".days-buy li").forEach(tab => {
			tab.addEventListener("click", () => {
				const dataTab = tab.getAttribute("data-tab");
				activeTabProces = parseInt(dataTab.match(/\d+/)[0], 10);
				updateTabs(activeTabProces);
			});
		});

// Next button handler
		document.querySelector(".js-next-proc-b")?.addEventListener("click", () => {
			if (activeTabProces < blockCountTabProces) {
				activeTabProces++;
				updateTabs(activeTabProces);
			}
		});

// Previous button handler
		document.querySelector(".js-prev-proc-b")?.addEventListener("click", () => {
			if (activeTabProces > 1) {
				activeTabProces--;
				updateTabs(activeTabProces);
			}
		});
	},

	calc: function (){

		document.addEventListener('DOMContentLoaded', function () {

			let dataIAAIUrl = "./iaai.json";
			let dataCopartUrl = "./copart.json";
			const eurUrl = 'https://api.nbrb.by/exrates/rates/EUR?parammode=2';
			const usdUrl = "https://api.nbrb.by/exrates/rates/USD?parammode=2";
			let calculationIAAIData = {};
			let calculationCopartData = {};
			let dateRate = "";
			let usdRate = 3.4;
			let eurRate = 3.5;
			let usdToEur = 1.05;
			let data = []

			async function loadCalculationData() {
				try {
					const response = await fetch(dataIAAIUrl);
					calculationIAAIData = await response.json();
					console.log("Данные загружены:", calculationIAAIData);

					const responseCopart = await fetch(dataCopartUrl);
					calculationCopartData = await responseCopart.json();
					console.log("Данные copart загружены:", calculationCopartData);

					getAuction();
					loadRates();
				} catch (error) {
					console.error("Ошибка загрузки JSON:", error);
				}
			}

			async function loadRates() {
				try {
					const responseEUR = await fetch(eurUrl);
					if (!responseEUR.ok) {
						throw new Error(`Ошибка при загрузке данных EUR: ${responseEUR.status}`);
					}
					const eurData = await responseEUR.json();
					eurRate = getRateFromJson(eurData);
					dateRate = formatDateToDDMMYYYY(eurData.Date);
					const responseUSD = await fetch(usdUrl);
					if (!responseUSD.ok) {
						throw new Error(`Ошибка при загрузке данных USD: ${responseUSD.status}`);
					}
					const usdData = await responseUSD.json();
					usdRate = getRateFromJson(usdData);
					usdToEur = eurRate / usdRate;
					// console.log("Date Rate:", dateRate);
					// console.log("USD Rate:", usdRate);
					// console.log("EUR Rate:", eurRate);
					// console.log("USD to EUR:", usdToEur);
					// document.getElementById("rates").innerHTML = `Курс валют НБРБ на ${dateRate}:<br> USD - ${usdRate}, EUR - ${eurRate}, EUR/USD - ${usdToEur.toFixed(4)}`;
				} catch (error) {
					console.error("Ошибка загрузки JSON:", error);
				}
			}

			function formatDateToDDMMYYYY(dateString) {
				const date = new Date(dateString);
				const day = String(date.getDate()).padStart(2, "0");
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const year = date.getFullYear();
				return `${day}.${month}.${year}`;
			}

			function getRateFromJson(data) {
				if (data && typeof data.Cur_OfficialRate === "number") {
					return data.Cur_OfficialRate;
				}
				console.error("Ключ 'Cur_OfficialRate' отсутствует или некорректен в JSON:", data);
				return null;
			}

			function getAuction() {
				const auctions = ["Copart", "IAAI"];
				const auctionSelect = document.getElementById("auctionType");
				auctionSelect.innerHTML = `<option value="" disabled selected>Выберите аукцион</option>`;
				auctions.forEach((auction) => {
					auctionSelect.innerHTML += `<option value="${auction}">${auction}</option>`;
				});
				auctionSelect.addEventListener("change", function () {
					if (auctionSelect.value) {
						lotLocation.removeAttribute("disabled");
						getPlaces();
					}
				});
			}

			function getPlaces() {
				let places = [];

				const selectedAuction = document.getElementById('auctionType').value.toLowerCase();
				let calculationData = calculationCopartData;

				places = [...new Set(calculationCopartData.map((item) => item.city))];
				if ( selectedAuction == 'iaai' ) {
					places = [...new Set(calculationIAAIData.map((item) => item.city))];
					calculationData = calculationIAAIData;

				}

				data = calculationData

				const placesWithDelivery = places.filter((place) => {
					const placeData = calculationData.filter((item) => item.city === place);
					const hasDelivery = placeData.some((item) => item && item !== " ");
					return hasDelivery;
				});
				const stateSelect = document.getElementById('lotLocation');
				stateSelect.innerHTML = `<option value="" disabled selected>Выберите площадку</option>`;
				placesWithDelivery.forEach((state) => {
					stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
				});

			}

			function calculateAuctionFee(auctionPrice) {

				let auctionFee1 = 0;
				if (auctionPrice >= 0 && auctionPrice < 50) {
					auctionFee1 = 1.00;
				} else if (auctionPrice >= 50 && auctionPrice < 100) {
					auctionFee1 = 1.00;
				} else if (auctionPrice >= 100 && auctionPrice < 200) {
					auctionFee1 = 25.00;
				} else if (auctionPrice >= 200 && auctionPrice < 300) {
					auctionFee1 = 60.00;
				} else if (auctionPrice >= 300 && auctionPrice < 350) {
					auctionFee1 = 80.00;
				} else if (auctionPrice >= 350 && auctionPrice < 400) {
					auctionFee1 = 90.00;
				} else if (auctionPrice >= 400 && auctionPrice < 450) {
					auctionFee1 = 120.00;
				} else if (auctionPrice >= 450 && auctionPrice < 500) {
					auctionFee1 = 130.00;
				} else if (auctionPrice >= 500 && auctionPrice < 550) {
					auctionFee1 = 140.00;
				} else if (auctionPrice >= 550 && auctionPrice < 600) {
					auctionFee1 = 150.00;
				} else if (auctionPrice >= 600 && auctionPrice < 700) {
					auctionFee1 = 165.00;
				} else if (auctionPrice >= 700 && auctionPrice < 800) {
					auctionFee1 = 185.00;
				} else if (auctionPrice >= 800 && auctionPrice < 900) {
					auctionFee1 = 200.00;
				} else if (auctionPrice >= 900 && auctionPrice < 1000) {
					auctionFee1 = 215.00;
				} else if (auctionPrice >= 1000 && auctionPrice < 1200) {
					auctionFee1 = 230.00;
				} else if (auctionPrice >= 1200 && auctionPrice < 1300) {
					auctionFee1 = 255.00;
				} else if (auctionPrice >= 1300 && auctionPrice < 1400) {
					auctionFee1 = 275.00;
				} else if (auctionPrice >= 1400 && auctionPrice < 1500) {
					auctionFee1 = 280.00;
				} else if (auctionPrice >= 1500 && auctionPrice < 1600) {
					auctionFee1 = 290.00;
				} else if (auctionPrice >= 1600 && auctionPrice < 1700) {
					auctionFee1 = 305.00;
				} else if (auctionPrice >= 1700 && auctionPrice < 1800) {
					auctionFee1 = 315.00;
				} else if (auctionPrice >= 1800 && auctionPrice < 2000) {
					auctionFee1 = 325.00;
				} else if (auctionPrice >= 2000 && auctionPrice < 2400) {
					auctionFee1 = 355.00;
				} else if (auctionPrice >= 2400 && auctionPrice < 2500) {
					auctionFee1 = 380.00;
				} else if (auctionPrice >= 2500 && auctionPrice < 3000) {
					auctionFee1 = 400.00;
				} else if (auctionPrice >= 3000 && auctionPrice < 3500) {
					auctionFee1 = 450.00;
				} else if (auctionPrice >= 3500 && auctionPrice < 4000) {
					auctionFee1 = 500.00;
				} else if (auctionPrice >= 4000 && auctionPrice < 4500) {
					auctionFee1 = 600.00;
				} else if (auctionPrice >= 4500 && auctionPrice < 5000) {
					auctionFee1 = 625.00;
				} else if (auctionPrice >= 5000 && auctionPrice < 6000) {
					auctionFee1 = 650.00;
				} else if (auctionPrice >= 6000 && auctionPrice < 6500) {
					auctionFee1 = 675.00;
				} else if (auctionPrice >= 6500 && auctionPrice < 7000) {
					auctionFee1 = 675.00;
				} else if (auctionPrice >= 7000 && auctionPrice < 7500) {
					auctionFee1 = 700.00;
				} else if (auctionPrice >= 7500 && auctionPrice < 8000) {
					auctionFee1 = 700.00;
				} else if (auctionPrice >= 8000 && auctionPrice < 8500) {
					auctionFee1 = 725.00;
				} else if (auctionPrice >= 8500 && auctionPrice < 9000) {
					auctionFee1 = 725.00;
				} else if (auctionPrice >= 9000 && auctionPrice < 10000) {
					auctionFee1 = 725.00;
				} else if (auctionPrice >= 10000 && auctionPrice < 10500) {
					auctionFee1 = 750.00;
				} else if (auctionPrice >= 10500 && auctionPrice < 11000) {
					auctionFee1 = 750.00;
				} else if (auctionPrice >= 11000 && auctionPrice < 11500) {
					auctionFee1 = 750.00;
				} else if (auctionPrice >= 11500 && auctionPrice < 12000) {
					auctionFee1 = 760.00;
				} else if (auctionPrice >= 12000 && auctionPrice < 12500) {
					auctionFee1 = 775.00;
				} else if (auctionPrice >= 12500 && auctionPrice < 15000) {
					auctionFee1 = 790.00;
				} else if (auctionPrice >= 15000) {
					auctionFee1 = auctionPrice * 0.06;
				} else {
					console.error("РћС€РёР±РєР°: РЅРµРєРѕСЂСЂРµРєС‚РЅРѕРµ Р·РЅР°С‡РµРЅРёРµ С†РµРЅС‹ Р°СѓРєС†РёРѕРЅР°.");
				}

				let auctionFee2 = 0;
				if (auctionPrice >= 0 && auctionPrice <= 100) {
					auctionFee2 = 0;
				} else if (auctionPrice >= 100 && auctionPrice < 500) {
					auctionFee2 = 49;
				} else if (auctionPrice >= 500 && auctionPrice < 1000) {
					auctionFee2 = 59;
				} else if (auctionPrice >= 1000 && auctionPrice < 1500) {
					auctionFee2 = 79;
				} else if (auctionPrice >= 1500 && auctionPrice < 2000) {
					auctionFee2 = 89;
				} else if (auctionPrice >= 2000 && auctionPrice < 4000) {
					auctionFee2 = 99;
				} else if (auctionPrice >= 4000 && auctionPrice < 6000) {
					auctionFee2 = 109;
				} else if (auctionPrice >= 6000 && auctionPrice < 8000) {
					auctionFee2 = 139;
				} else {
					auctionFee2 = 149;
				}

				return auctionFee1 + auctionFee2 + 10 + 79
			}

			function calculateDuty(vehicleAge, engineVolume, carCost) {
				let duty = 0;
				if (vehicleAge === 1) {
					if (carCost <= 8500) {
						duty = Math.max(0.54 * carCost, 2.5 * engineVolume);
					} else if (carCost <= 16700) {
						duty = Math.max(0.48 * carCost, 3.5 * engineVolume);
					} else if (carCost <= 42300) {
						duty = Math.max(0.48 * carCost, 5.5 * engineVolume);
					} else if (carCost <= 84500) {
						duty = Math.max(0.48 * carCost, 7.5 * engineVolume);
					} else if (carCost <= 169000) {
						duty = Math.max(0.48 * carCost, 15 * engineVolume);
					} else {
						duty = Math.max(0.48 * carCost, 20 * engineVolume);
					}
				} else if (vehicleAge === 2) {
					if (engineVolume <= 1000) {
						duty = 1.5 * engineVolume;
					} else if (engineVolume <= 1500) {
						duty = 1.7 * engineVolume;
					} else if (engineVolume <= 1800) {
						duty = 2.5 * engineVolume;
					} else if (engineVolume <= 2300) {
						duty = 2.7 * engineVolume;
					} else if (engineVolume <= 3000) {
						duty = 3 * engineVolume;
					} else {
						duty = 3.6 * engineVolume;
					}
				} else {
					if (engineVolume <= 1000) {
						duty = 3 * engineVolume;
					} else if (engineVolume <= 1500) {
						duty = 3.2 * engineVolume;
					} else if (engineVolume <= 1800) {
						duty = 3.5 * engineVolume;
					} else if (engineVolume <= 2300) {
						duty = 4.8 * engineVolume;
					} else if (engineVolume <= 3000) {
						duty = 5 * engineVolume;
					} else {
						duty = 5.7 * engineVolume;
					}
				}
				return duty;
			}

			function calculateOcean(auctionType, lotLocation, port, type) {
				console.log("auctionType: " + auctionType);
				console.log("Location: " + lotLocation);
				console.log("Port: " + port);
				console.log("Type: " + type);

				let usaDeliveryRow = calculationCopartData.find((item) => item.city === lotLocation);
				if ( auctionType === 'iaai' ) {
					usaDeliveryRow = calculationIAAIData.find((item) => item.city === lotLocation);
				}

				const oceanDeliveryGR = [
					{ warehouse: "NEW YORK", priceSedan: 850, priceLarge: 950, priceBigSuv: 1300, priceMoto: 400},
					{ warehouse: "NORFOLK", priceSedan: 850, priceLarge: 950, priceBigSuv: 1300, priceMoto: 400},
					{ warehouse: "SAVANNAH", priceSedan: 800, priceLarge: 900, priceBigSuv: 1250, priceMoto: 400},
					{ warehouse: "MIAMI", priceSedan: 900, priceLarge: 1000, priceBigSuv: 1300, priceMoto: 425},
					{ warehouse: "HOUSTON", priceSedan: 975, priceLarge: 1075, priceBigSuv: 1400, priceMoto: 450},
					{ warehouse: "CHICAGO", priceSedan: 1000, priceLarge: 1100, priceBigSuv: 1450, priceMoto: 475},
					{ warehouse: "LOS ANGELES", priceSedan: 1500, priceLarge: 1600, priceBigSuv: 1950, priceMoto: 750},
					{ warehouse: "SEATTLE", priceSedan: 1400, priceLarge: 1500, priceBigSuv: 2400, priceMoto: 800},
					{ warehouse: "TORONTO", priceSedan: 1200, priceLarge: 1350, priceBigSuv: 1650, priceMoto: 525},
				];


				const oceanDeliveryLT = [
					{ warehouse: "NEW YORK", priceSedan: 700, priceLarge: 750, priceBigSuv: 1000, priceMoto: 375},
					{ warehouse: "NORFOLK", priceSedan: 700, priceLarge: 750, priceBigSuv: 1000, priceMoto: 375},
					{ warehouse: "SAVANNAH", priceSedan: 700, priceLarge: 750, priceBigSuv: 1000, priceMoto: 375},
					{ warehouse: "MIAMI", priceSedan: 775, priceLarge: 825, priceBigSuv: 1075, priceMoto: 400},
					{ warehouse: "HOUSTON", priceSedan: 825, priceLarge: 875, priceBigSuv: 1200, priceMoto: 425},
					{ warehouse: "CHICAGO", priceSedan: 900, priceLarge: 950, priceBigSuv: 1250, priceMoto: 425},
					{ warehouse: "LOS ANGELES", priceSedan: 1300, priceLarge: 1350, priceBigSuv: 1700, priceMoto: 550},
					{ warehouse: "SEATTLE", priceSedan: 1700, priceLarge: 1800, priceBigSuv: 2400, priceMoto: 750},
					{ warehouse: "TORONTO", priceSedan: 1000, priceLarge: 1050, priceBigSuv: 1350, priceMoto: 500},
				];
				if (type === "sedan") {
					console.log("Run type sedan");
					if (port === "georgia") {
						return oceanDeliveryGR.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceSedan;
					} else {
						return oceanDeliveryLT.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceSedan;
					}
				} else if (type === "big" || type === "pickUp") {
					console.log("Run type big");
					if (port === "georgia") {
						return oceanDeliveryGR.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceBigSuv;
					} else {
						return oceanDeliveryLT.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceBigSuv;
					}
				} else if (type === "moto") {
					console.log("Run type moto");
					if (port === "georgia") {
						return oceanDeliveryGR.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceMoto;
					} else {
						return oceanDeliveryLT.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceMoto;
					}
				} else if (type === "large") {
					console.log("Run type large");
					if (port === "georgia") {
						return oceanDeliveryGR.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceLarge;
					} else {
						return oceanDeliveryLT.find((item) => item.warehouse === usaDeliveryRow.warehouse).priceLarge;
					}
				}
			}

			function calculateRecyclingFee(vehicleAge) {
				if (vehicleAge === 1) {
					return 544.5;
				} else {
					return 1089;
				}
			}

			function calculateMotoDuty(carCost, engineVolume, electric) {
				let percent = 0;
				if (engineVolume < 250) {
					percent = 14;
				} else if (engineVolume < 800) {
					percent = 15;
				} else {
					percent = 10;
				}
				if (electric) {
					percent = 14;
				}
				let duty = (carCost * percent) / 100;
				let nds = ((carCost + duty) * 20) / 100;
				return duty + nds;
			}

			function addFireContainer(fireContainer) {
				let fireContainerElement = document.getElementById("fireContainerRow");
				const portFeeElement = document.getElementById("portFee").parentNode;
				if (fireContainer > 0) {
					if (!fireContainerElement) {
						fireContainerElement = document.createElement("p");
						fireContainerElement.id = "fireContainerRow";
						fireContainerElement.innerHTML = `Огнеупорный контейнер: <span id="fireContainer">$${fireContainer}</span>`;
						portFeeElement.parentNode.insertBefore(fireContainerElement, portFeeElement.nextSibling);
					} else {
						document.getElementById("fireContainer").textContent = `$${fireContainer}`;
					}
				} else if (fireContainerElement) {
					fireContainerElement.remove();
				}
			}

			function calculate() {
				const carCost = parseFloat(document.getElementById("carCost").value || 0);
				const auctionType = document.getElementById("auctionType").value.toLowerCase();
				const engineVolume = parseFloat(document.getElementById("engineVolume").value || 0);
				const lotLocation = document.getElementById("lotLocation").value;
				const port = document.getElementById("delivery").value;
				const carType = document.getElementById("carType").value;
				const carAge = parseFloat(document.getElementById("carAge").value || 0);
				const discount = document.getElementById("discount").checked;
				const electric = document.getElementById("electric").checked;
				const gibrid = document.getElementById("gibrid").checked;
				const insurance = document.getElementById("insurance").checked;

				if(!lotLocation) return

				let usaDeliveryRow;
				let deliveryToPort;

				usaDeliveryRow = data.find((item) => item.city === lotLocation);
				if ( carType === 'sedan' ) {
					deliveryToPort = usaDeliveryRow?.['large'] || 0;
				}
				if ( carType === 'large' || carType === 'big' ) {
					deliveryToPort = usaDeliveryRow?.['oversize'] || 0;
				}
				if ( carType === 'moto' ) {
					deliveryToPort = usaDeliveryRow?.['moto'] || 0;
				}


				let usaPortName = usaDeliveryRow?.warehouse || "";
				if (!Number.isFinite(deliveryToPort)) {
					deliveryToPort = 0;
				}
				let deliveryByOcean = calculateOcean(auctionType, lotLocation, port, carType);
				let customsDuty = calculateDuty(carAge, engineVolume, carCost);
				let auctionFee = calculateAuctionFee(carCost);
				let recyclingFee = calculateRecyclingFee(carAge);
				let fireContainer = 0;
				if (electric) {
					customsDuty = 0;
					fireContainer = 300;
				}
				if (gibrid) {
					fireContainer = 300;
				}
				if (carType === "moto") {
					customsDuty = calculateMotoDuty(carCost, engineVolume, electric);
				}
				if (discount) {
					customsDuty *= 0.5;
				}
				addFireContainer(fireContainer);
				let portFee = 150;
				const customsFee = 120;
				const storageFee = 400;
				console.log(usdRate)
				let costToMinsk = port === 'georgia'  ? 2700 : 960
				let total = costToMinsk + carCost + fireContainer + auctionFee + deliveryToPort + deliveryByOcean + portFee + customsDuty * usdToEur + (customsFee + recyclingFee + storageFee) / usdRate;
				if (insurance) {
					total += total * 0.03;
				}

				document.getElementById("purchaseCost").textContent = `${carCost} $`;
				document.getElementById("auctionFee").textContent = `${auctionFee.toFixed(0)} $`;
				// document.getElementById("deliveryToPort").textContent = `${deliveryToPort} $`;
				// document.getElementById("usaPortName").textContent = `Транспортировка в порт ${usaPortName}:`;
				// document.getElementById("deliveryByOcean").textContent = `${deliveryByOcean} $`;
				document.getElementById("deliveryToMinsk").textContent = `${costToMinsk} $`;
				document.getElementById("portFee").textContent = `${portFee} $`;
				document.getElementById("customsDuty").textContent = `${customsDuty.toFixed(0)} €`;
				document.getElementById("customsFee").textContent = `${customsFee} BYN`;
				document.getElementById("recyclingFee").textContent = `${recyclingFee} BYN`;
				document.getElementById("storageFee").textContent = `${storageFee} BYN`;
				document.getElementById("total").textContent = `${total.toFixed(0)} $`;
			}

			const expenseCalculator = document.getElementById('expense-calculator');

			if ( expenseCalculator ) {
				document.getElementById('expense-calculator').addEventListener('change', calculate);
				loadCalculationData();
			}
		});
	}
};

export default uiInits
