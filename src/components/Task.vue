<template>
    <div class="card task">
        <div class="card-body py-2 px-3">
            <p class="card-text text-left mb-1">{{todo}}</p>
            <div class="d-flex justify-content-between">
                <div v-if="completed" class="text-right status text-success">Completed</div>
                <div v-else class="text-right status text-primary">Pending</div>
                <div>
                    <a href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><b>...</b></a>
                    <div class="dropdown-menu" style="">
                        <a v-if="!completed" class="dropdown-item" href="#" @click.prevent="$emit('statusClick',$event.target.innerText)">Completed</a>
                        <a v-else class="dropdown-item" href="#" @click.prevent="$emit('statusClick',$event.target.innerText)">Pending</a>
                        <a class="dropdown-item" href="#" @click.prevent="$emit('statusClick',$event.target.innerText)">Delete</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        todo: {
            type: String,
            default: null
        },
        completed: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        click: {
            type: Function,
            default: null
        }
    },
    emits: ['statusClick']
}
</script>

<style scoped>
.status{
    font-size: .7rem;
}
p{
    line-height: 1.2;
}

/* scroll Bar */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>