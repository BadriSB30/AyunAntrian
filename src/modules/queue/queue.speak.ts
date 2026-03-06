//src/modules/queue/queue.speak.ts

export const speakQueue = (nomorAntrian: string | number, namaLoket: string) => {
	if (typeof window === 'undefined') return;

	const text = `Antrian ${String(nomorAntrian)} ke ${namaLoket}`;

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'id-ID';
	utterance.rate = 0.5;
	utterance.pitch = 1;

	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(utterance);
};
