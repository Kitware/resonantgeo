async function setInput(wrapper, selector, value) {
  await wrapper.vm.$nextTick();
  const input = wrapper.find(selector);
  input.element.value = value;
  input.trigger('input');
  return wrapper.vm.$nextTick();
}

export { setInput }; // eslint-disable-line import/prefer-default-export
