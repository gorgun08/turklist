import { store } from '../main.js';
import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchEditors, fetchList } from '../content.js';

import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';

const roleIconMap = {
	owner: 'crown',
	admin: 'user-gear',
	helper: 'user-shield',
	dev: 'code',
	trial: 'user-lock',
};

export default {
	components: { Spinner, LevelAuthors },
	template: `
        <main v-if="loading" class="surface">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container surface">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 75" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container surface">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <div v-if="level.showcase" class="tabs">
                        <button class="tab type-label-lg" :class="{selected: !toggledShowcase}" @click="toggledShowcase = false">
                            <span class="type-label-lg">Verification</span>
                        </button>
                        <button class="tab" :class="{selected: toggledShowcase}" @click="toggledShowcase = true">
                            <span class="type-label-lg">Showcase</span>
                        </button>
                    </div>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Geçince Kazanılan Puan</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Levelin Şifresi</div>
                            <p>{{ level.password || 'Yok' }}</p>
                        </li>
                    </ul>
                    <h2>Recordlar</h2>
                    <p v-if="selected + 1 <= 30">Record atabilmek için <strong>{{ level.percentToQualify }}%</strong> ya da daha fazla yap</p>
                    <p v-else-if="selected +1 <= 150">Record atabilmek için <strong>100%</strong> ya da daha fazla yap</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}FPS</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container surface">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editörleri</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${(store.dark || store.shitty) ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h7>
                    (Bu list "The Shitty List"i template alarak yapılmıştır.)
                    </h7>
                    <h3>Record Gereksinimleri</h3>
                    <p>
                    Recordun hilesiz olduğuna dair kesin bir kanıt olmalı.
                    </p>
                    <p>
                    Raw footage minimum 3-5 dakika olmalı ve geçmeden önceki attempti de göstermelidir.
                    </p>
                    <p>
                    Eğer leveli levele girdiğiniz ilk attemptte geçtiyseniz levele girmeden önce menünün kaydını da gösteriniz.
                    </p>
                    <p>
                    Raw footage videonun sesini değiştirmeyiniz.
                    </p>
                    <p>
                    Click sesleri ve mümkünse CPS göstergesi bulunmalıdır.
                    </p>
                    <p>
                    Geçtiğiniz levelin id'si ile listteki id uyuşmalıdır.
                    </p>
                    <p>
                    Level editlenmemiş olmalıdır.
                    </p>
                    <p>
                    LEGACY RECORDLARI KABUL EDİLMİYOR!!!
                    </p>
                </div>
            </div>
        </main>
    `,
	data: () => ({
		list: [],
		editors: [],
		loading: true,
		selected: 0,
		errors: [],
		roleIconMap,
		store,
		toggledShowcase: false,
	}),
	computed: {
		level() {
			return this.list[this.selected][0];
		},
		video() {
			if (!this.level.showcase) {
				return embed(this.level.verification);
			}

			return embed(
				this.toggledShowcase ? this.level.showcase : this.level.verification,
			);
		},
	},
	async mounted() {
		// Hide loading spinner
		this.list = await fetchList();
		this.editors = await fetchEditors();

		// Error handling
		if (!this.list) {
			this.errors = [
				'Failed to load list. Retry in a few minutes or notify list staff.',
			];
		} else {
			this.errors.push(
				...this.list
					.filter(([_, err]) => err)
					.map(([_, err]) => {
						return `Failed to load level. (${err}.json)`;
					}),
			);
			if (!this.editors) {
				this.errors.push('Failed to load list editors.');
			}
		}

		this.loading = false;
	},
	methods: {
		embed,
		score,
	},
};
