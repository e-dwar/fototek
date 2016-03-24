<?php require_once('lib/constants.php'); ?>
<div class="frame" id="image-{{id}}">
    <div class="thumb">
        <?php if (!IS_GUEST) { ?><a href="javascript:void 0"><?php } ?></a>
        <img 
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
            style="background-image: url(<?php echo ROOT; ?>thumbs/{{thumbnail}})" 
        />
    </div>
</div>
<!--
Structure d'une vignette.
-->
